const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));
const port = process.env.PORT || 8080;
const locations = [
    { lat: 40.7128, lng: -74.0060, city: 'New York, NY, USA', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193571.1963729447!2d-74.11976373733446!3d40.70582535942257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1721100000000!5m2!1sen!2sus' },
    { lat: 34.0522, lng: -118.2437, city: 'Los Angeles, CA, USA', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211546.3827257342!2d-118.41169395295982!3d34.05369090155096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2sus!4v1721100000000!5m2!1sen!2sus' },
    { lat: 51.5074, lng: -0.1278, city: 'London, UK', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.8299942369!2d-0.2416812164349143!3d51.5287718408993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2suk!4v1721100000000!5m2!1sen!2suk' },
    { lat: 48.8566, lng: 2.3522, city: 'Paris, France', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d167997.3711998394!2d2.207474240338731!3d48.8588548812497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sen!2sfr!4v1721100000000!5m2!1sen!2sfr' },
    { lat: 35.6895, lng: 139.6917, city: 'Tokyo, Japan', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d414793.9934394998!2d139.4602124950746!3d35.66816253382734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b857628235d%3A0xcdd8aef709a2b520!2sTokyo%2C%20Japan!5e0!3m2!1sen!2sjp!4v1721100000000!5m2!1sen!2sjp' }
];
const carriers = {
    '+1': ['AT&T', 'Verizon', 'T-Mobile', 'Sprint'],
    '+44': ['Vodafone', 'EE', 'O2', 'Three'],
    '+61': ['Telstra', 'Optus', 'Vodafone', 'TPG'],
    '+49': ['Telekom', 'Vodafone', 'O2', 'E-Plus']
};
function validatePhoneNumber(phoneNumber) {
    const patterns = {
        '+1': /^\+\d{11}$/,
        '+44': /^\+\d{12,13}$/,
        '+61': /^\+\d{11}$/,
        '+49': /^\+\d{12,13}$/
    };
    const countryCode = phoneNumber.match(/^\+\d+/)[0];
    return patterns[countryCode]?.test(phoneNumber) || false;
}
function getLocation(phoneNumber) {
    const countryCode = phoneNumber.match(/^\+\d+/)[0];
    const numberPart = phoneNumber.replace(countryCode, '');
    const locationIndex = parseInt(numberPart.slice(0, 2)) % locations.length;
    return locations[locationIndex];
}
function getCarrier(phoneNumber) {
    const countryCode = phoneNumber.match(/^\+\d+/)[0];
    const carrierList = carriers[countryCode] || ['Unknown'];
    return carrierList[parseInt(phoneNumber.replace(countryCode, '').slice(0, 2)) % carrierList.length];
}
function getAccuracy(phoneNumber) {
    const numberPart = phoneNumber.replace(/^\+\d+/, '');
    return (parseInt(numberPart.slice(0, 3)) % 5 + 1).toFixed(1);
}
function getNetworkType() {
    return ['4G', '5G', '3G'][Math.floor(Math.random() * 3)];
}
function getSignalStrength() {
    return Math.floor(Math.random() * 100);
}
function getDeviceType() {
    return ['Smartphone', 'Tablet', 'Feature Phone'][Math.floor(Math.random() * 3)];
}
function getIPAddress() {
    return `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}
function getTimeZone() {
    return ['UTC-5', 'UTC+1', 'UTC+9'][Math.floor(Math.random() * 3)];
}
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/numbers', (req, res) => {
    res.sendFile(path.join(__dirname, 'numbers.html'));
});
app.post('/api/locate', (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }
    const location = getLocation(phoneNumber);
    const carrier = getCarrier(phoneNumber);
    const accuracy = getAccuracy(phoneNumber);
    const networkType = getNetworkType();
    const signalStrength = getSignalStrength();
    const deviceType = getDeviceType();
    const ipAddress = getIPAddress();
    const timeZone = getTimeZone();
    res.json({ ...location, carrier, accuracy, networkType, signalStrength, deviceType, ipAddress, timeZone });
});
app.listen(port, () => console.log(`Server running on port ${port}`));
