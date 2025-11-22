// sms.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

@Injectable()
export class SmsService {
  private readonly apiKey = process.env.KUDI_SMS_API_TOKEN;

  async sendSms(to: string, message: string) {
    const url = `https://my.kudisms.net/api/sms?token=${this.apiKey};`
    const payload = {
      apiKey: this.apiKey,
      sender: process.env.KUDI_SMS_SENDER,
      message,
      mobiles: to,
    };

    try {
      const response = await axios.get(url, {
        params: {
          token: this.apiKey,
          senderID: process.env.KUDI_SMS_SENDER,
          recipients: to,
          message: message,
        },
      });
      return response.data;
  }
  
     catch (error) {
      // Log error for debugging
      console.error('KudiSMS Error:', error?.response?.data || error.message);
      throw new Error(`SMS send failed: ${error?.response?.data || error.message}`);
    }
  }
}

