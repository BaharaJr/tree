import { Injectable } from '@nestjs/common';
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'fs';
import * as jszip from 'jszip';
import { systemConfig } from './core/system/system.config';
import { FileInterface } from './shared/interfaces/file.interface';

@Injectable()
export class AppService {
  create = async (file: FileInterface) => {
    const zip = readFileSync(file.path);
    const contents = await new jszip().loadAsync(zip);

    if (Object.keys(contents.files).includes('index.html')) {
      this.updateFiles(file.path);
      return await this.unzip(contents.files);
    }
    return { status: false, error: 'Missing entry point' };
  };

  private unzip = async (files: any) => {
    mkdirSync(`${systemConfig.TMP}/app`);
    const keys = Object.keys(files);
    for (const key of keys) {
      const file = files[key];
      await this.createFiles(file);
    }
    return { status: true, message: 'App updated' };
  };

  private createFiles = async (file: any) => {
    const location = `${systemConfig.TMP}/app`;
    try {
      if (file.dir) {
        mkdirSync(`${location}/${file.name}`);
      } else {
        writeFileSync(
          `${location}/${file.name}`,
          Buffer.from(await file.async('arraybuffer')),
        );
      }
    } catch (e) {}
  };

  private updateFiles = (path: string) => {
    try {
      rmSync(path, { recursive: true });
      rmSync(systemConfig.FRONTEND, { recursive: true });
      renameSync(`${systemConfig.TMP}/app`, systemConfig.FRONTEND);
      rmSync(`${systemConfig.TMP}/app`, { recursive: true });
    } catch (e) {}
  };
}
