import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { KafkaService } from './kafka.service';

@Controller('save')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post()
  async saveData(@Body() body: any, @Res() res: Response) {
    const { data, hora, caminhoPecorrido } = body;

    if (!data || !hora || !caminhoPecorrido) {
      return res.status(HttpStatus.BAD_REQUEST).send('Data, hora e caminhoPecorrido são obrigatórios');
    }

    try {
      await this.kafkaService.sendToKafka({ data, hora, caminhoPecorrido });
      return res.status(HttpStatus.OK).send('Dados enviados para o Kafka com sucesso');
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Erro ao enviar dados para o Kafka');
    }
  }
}
