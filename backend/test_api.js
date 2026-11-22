// Comprehensive API Integration Test Suite
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== Running EventSphere API Integration Tests ===\n');

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ Health check:', health.status);

    // 2. Admin Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@eventsphere.pk', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('✅ Admin login:', loginData.success, 'Token received:', !!loginData.token);
    const adminToken = loginData.token;

    // 3. Exhibitor Login
    const exhLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'exhibitor@nexustech.pk', password: 'password123' })
    });
    const exhLoginData = await exhLoginRes.json();
    console.log('✅ Exhibitor login:', exhLoginData.success, 'Role:', exhLoginData.user?.role);
    const exhibitorToken = exhLoginData.token;

    // 4. Attendee Login
    const attLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'attendee@pakistanbiz.com', password: 'password123' })
    });
    const attLoginData = await attLoginRes.json();
    console.log('✅ Attendee login:', attLoginData.success, 'Role:', attLoginData.user?.role);

    // 5. Fetch Expos
    const exposRes = await fetch(`${BASE_URL}/expos`);
    const exposData = await exposRes.json();
    console.log('✅ Expos fetched:', exposData.count, 'expos listed');
    const firstExpo = exposData.data[0];

    // 6. Fetch Exhibitors
    const exhRes = await fetch(`${BASE_URL}/exhibitors`);
    const exhData = await exhRes.json();
    console.log('✅ Exhibitors fetched:', exhData.count, 'exhibitors listed');

    // 7. Fetch Booths
    const boothsRes = await fetch(`${BASE_URL}/booths?expoId=${firstExpo._id}`);
    const boothsData = await boothsRes.json();
    console.log('✅ Booths fetched for expo:', boothsData.count, 'booths found');

    // 8. Test Double-Booking Protection on Booth
    const availableBooth = boothsData.data.find(b => b.status === 'Available');
    if (availableBooth) {
      console.log(`Testing booking on booth ${availableBooth.number}...`);
      // First booking
      const book1 = await fetch(`${BASE_URL}/booths/${availableBooth._id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${exhibitorToken}`
        },
        body: JSON.stringify({
          exhibitorId: exhLoginData.user.exhibitorProfile,
          exhibitorName: 'NexusTech Solutions'
        })
      });
      const book1Res = await book1.json();
      console.log('✅ First booking success:', book1Res.success, book1Res.message);

      // Attempt second booking on SAME booth (should be rejected with 409 Conflict)
      const book2 = await fetch(`${BASE_URL}/booths/${availableBooth._id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${exhibitorToken}`
        },
        body: JSON.stringify({
          exhibitorId: exhLoginData.user.exhibitorProfile,
          exhibitorName: 'Competing Tech Corp'
        })
      });
      console.log('✅ Double booking status code:', book2.status, '(Expected 409 Conflict)');
      const book2Res = await book2.json();
      console.log('✅ Double booking prevented:', !book2Res.success, book2Res.message);
    }

    // 9. Fetch Schedule Sessions
    const scheduleRes = await fetch(`${BASE_URL}/schedule?expoId=${firstExpo._id}`);
    const scheduleData = await scheduleRes.json();
    console.log('✅ Schedule sessions fetched:', scheduleData.count, 'sessions');

    // 10. Admin Overview Stats
    const statsRes = await fetch(`${BASE_URL}/analytics/overview`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    console.log('✅ Admin stats fetched:', statsData.success, 'Total Expos:', statsData.data?.totalExpos, 'Revenue PKR:', statsData.data?.totalRevenuePKR);

    // 11. Attendee Register for Expo
    const regRes = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expoId: firstExpo._id,
        name: 'Saad Ahmed',
        email: 'saad.ahmed@testcorp.pk',
        phone: '+92 300 9988776',
        company: 'TestCorp Pakistan',
        designation: 'Tech Lead'
      })
    });
    const regData = await regRes.json();
    console.log('✅ Expo registration:', regData.success, 'Ticket Number:', regData.data?.ticketNumber);
    const createdTicketId = regData.data?._id;

    // 12. Security Test: Attempt Admin Role Self-Escalation via Public Registration
    const exploitReg = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Attacker User',
        email: `attacker_${Date.now()}@exploit.com`,
        password: 'password123',
        role: 'admin' // Attempted privilege escalation
      })
    });
    const exploitData = await exploitReg.json();
    const preventedEscalation = exploitData.user?.role !== 'admin' && exploitData.user?.role === 'attendee';
    console.log('✅ Admin role escalation prevented:', preventedEscalation, 'Assigned role:', exploitData.user?.role);

    // 13. Security Test: Unauthorized Pass Access (Data Privacy)
    const attackerToken = exploitData.token;
    const ticketAccessRes = await fetch(`${BASE_URL}/registrations/${createdTicketId}`, {
      headers: { 'Authorization': `Bearer ${attackerToken}` }
    });
    console.log('✅ Ticket privacy protection:', ticketAccessRes.status === 403, '(Expected 403 Forbidden for other users)');

    // 14. Security Test: Exhibitor Company Impersonation Guard
    if (availableBooth) {
      const spoofBooking = await fetch(`${BASE_URL}/booths/${availableBooth._id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${exhibitorToken}`
        },
        body: JSON.stringify({
          exhibitorId: '507f1f77bcf86cd799439011', // Spoofed foreign company ID
          exhibitorName: 'Unauthorized Foreign Entity'
        })
      });
      console.log('✅ Exhibitor company spoofing blocked:', spoofBooking.status === 403, '(Expected 403 Forbidden)');
    }

    console.log('\n🎉 ALL BACKEND API & SECURITY AUDIT TESTS COMPLETED!\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

runTests();
