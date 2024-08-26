import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaClient, Producer } from 'kafka-node';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);
  private producer: Producer;

  constructor(private configService: ConfigService) {
    const kafkaHost = this.configService.get<string>('KAFKA_HOST');
    const topic = this.configService.get<string>('KAFKA_TOPIC');

    const client = new KafkaClient({ kafkaHost });
    this.producer = new Producer(client);

    this.producer.on('ready', () => {
      this.logger.log('Producer está pronto');
    });

    this.producer.on('error', (err) => {
      this.logger.error('Erro no Producer:', err);
    });
  }

  async sendToKafka(statsData: any) {
    const topic = this.configService.get<string>('KAFKA_TOPIC');
    const payload = [
      {
        topic: topic,
        messages: JSON.stringify(statsData),
      },
    ];

    return new Promise((resolve, reject) => {
      this.producer.send(payload, (err, data) => {
        if (err) {
          this.logger.error('Erro ao enviar mensagem para o Kafka:', err);
          reject(err);
        } else {
          this.logger.log('Mensagem enviada para o Kafka:', data);
          resolve(data);
        }
      });
    });
  }
}
