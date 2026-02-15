async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get password from command line arg or input
const password = process.argv[2];

if (!password) {
    console.log("Usage: node generate-hash.js <your_password>");
    process.exit(1);
}

hashPassword(password).then(hash => {
    console.log(`\nPassword: ${password}`);
    console.log(`SHA-256 Hash: ${hash}\n`);
    console.log(`Use this hash as the value for VITE_APP_PASSWORD in your GitHub Secrets.`);
});
