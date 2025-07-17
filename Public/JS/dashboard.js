const jwt = await account.createJWT(); 
console.log('ATTEMPTINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')
fetch('/dashboard', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${jwt.jwt}`,
  },
  body: JSON.stringify({})
});