const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let orders = []; // Store orders in memory

app.post('/order', (req, res) => {
    const orderData = req.body;
    orders.push(orderData);
    res.status(200).json({ message: 'Order data saved successfully' });
});

app.get('/order-history', (req, res) => {
    res.status(200).json(orders);
});

app.get('/export-orders', async (req, res) => {
    try {
        const csvFilePath = path.join(__dirname, 'orders.csv');
        const csvWriterInstance = csvWriter({
            path: csvFilePath,
            header: [
                { id: 'iceType', title: 'Ice Type' },
                { id: 'quantity', title: 'Quantity' },
                { id: 'contactNumber', title: 'Contact Number' },
                { id: 'address', title: 'Address' },
                { id: 'latitude', title: 'Latitude' },
                { id: 'longitude', title: 'Longitude' },
                { id: 'date', title: 'Date' },
                { id: 'totalPrice', title: 'Total Price' }
            ]
        });
        await csvWriterInstance.writeRecords(orders);

        // Google Drive API setup
        const auth = new google.auth.GoogleAuth({
            keyFile: 'path/to/your/service-account-file.json', // แก้ไขเส้นทางไปยังไฟล์คีย์ของบัญชีบริการ
            scopes: ['https://www.googleapis.com/auth/drive.file']
        });
        const drive = google.drive({ version: 'v3', auth });

        const fileMetadata = {
            name: 'orders.csv',
            parents: ['your-google-drive-folder-id']
        };
        const media = {
            mimeType: 'text/csv',
            body: fs.createReadStream(csvFilePath)
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });

        res.status(200).json({ message: 'Orders exported to Google Drive', fileId: response.data.id });
    } catch (err) {
        console.error('Error exporting orders', err);
        res.status(500).json({ error: 'Failed to export orders' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
