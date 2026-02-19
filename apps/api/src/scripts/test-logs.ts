import { sendSmsCode } from '../sms/sms.service';
import { sendVerificationEmail } from '../mail/mail.service';

async function test() {
  console.log('--- Testing SMS Log ---');
  await sendSmsCode('18888888888', '123456');
  
  console.log('\n--- Testing Email Log ---');
  // Avoid actual sending by catching error if transporter fails, we just want to see the log before transporter call
  try {
    await sendVerificationEmail('test@example.com', '654321');
  } catch (err) {
    // Expected to fail if no ENV is set, but the log should appear before this
  }
}

test();
