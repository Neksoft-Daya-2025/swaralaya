import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async get<T = unknown>(key: string, defaultValue: T | null = null): Promise<T | null> {
    const setting = await this.settingsRepository.findOne({ where: { key } });

    if (!setting?.value) {
      return defaultValue;
    }

    if (setting.type === 'json') {
      try {
        return JSON.parse(setting.value) as T;
      } catch {
        return defaultValue;
      }
    }

    return setting.value as T;
  }

  async set(
    key: string,
    value: unknown,
    type = 'string',
    description: string | null = null,
  ): Promise<void> {
    let valueToStore = '';

    if (type === 'json') {
      valueToStore = JSON.stringify(value);
    } else {
      valueToStore = String(value);
    }

    const existing = await this.settingsRepository.findOne({ where: { key } });

    if (existing) {
      await this.settingsRepository.update(existing.id, {
        value: valueToStore,
        type,
        description: description ?? existing.description,
      });
      return;
    }

    await this.settingsRepository.save(
      this.settingsRepository.create({
        key,
        value: valueToStore,
        type,
        description,
      }),
    );
  }
}
