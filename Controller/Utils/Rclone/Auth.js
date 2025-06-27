const auth = () => {

    const username = process.env.RCL_USERNAME
    const password = process.env.RCL_PASSWORD
    const hostname = process.env.RCL_HOSTNAME
    const port = process.env.RCL_PORT
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    return {hostname, port, auth}
}
exports.auth = auth;