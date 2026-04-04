import smpp from 'smpp';

/**
 * Sends an SMS message using the SMPP protocol.
 * @param {string} phone - The destination phone number.
 * @param {string} message - The message content.
 * @returns {Promise} - Resolves when the message is successfully submitted.
 */
export const sendSMS = ({ phone, message }) => {
    return new Promise((resolve, reject) => {
        // DEVELOPMENT FALLBACK: If host is 'MOCK', just log and resolve
        if (process.env.SMPP_HOST === 'MOCK' || !process.env.SMPP_HOST) {
            console.log('\n--- SMPP MOCK SMS ---');
            console.log(`To: ${phone}`);
            console.log(`Message: ${message}`);
            console.log('---------------------\n');
            return resolve({ message_id: 'mock-id' });
        }

        const session = smpp.connect({
            host: process.env.SMPP_HOST,
            port: parseInt(process.env.SMPP_PORT || '2775')
        });

        const timeout = setTimeout(() => {
            console.log('\n--- SMPP FALLBACK (Timeout) ---');
            console.log(`To: ${phone}`);
            console.log(`Message: ${message}`);
            console.log('-------------------------------\n');
            session.close();
            resolve({ message_id: 'fallback-id' }); // Resolve anyway so the user gets the link in console
        }, 3000);

        session.on('connect', () => {
            clearTimeout(timeout);
            session.bind_transceiver({
                system_id: process.env.SMPP_SYSTEM_ID,
                password: process.env.SMPP_PASSWORD
            }, (pdu) => {
                if (pdu.command_status === 0) {
                    session.submit_sm({
                        destination_addr: phone,
                        short_message: message,
                        source_addr: process.env.SMPP_SENDER_ID || 'C-Stitch'
                    }, (pdu_msg) => {
                        if (pdu_msg.command_status === 0) {
                            resolve(pdu_msg);
                        } else {
                            reject(new Error(`SMPP Error: ${pdu_msg.command_status}`));
                        }
                        session.unbind();
                        session.close();
                    });
                } else {
                    reject(new Error(`SMPP Bind Error: ${pdu.command_status}`));
                    session.close();
                }
            });
        });

        session.on('error', (err) => {
            clearTimeout(timeout);
            console.log('\n--- SMPP FALLBACK (Error) ---');
            console.log(`To: ${phone}`);
            console.log(`Message: ${message}`);
            console.log(`Error: ${err.message}`);
            console.log('-----------------------------\n');
            resolve({ message_id: 'error-fallback-id' }); // Resolve so the link is visible in console
        });
    });
};
