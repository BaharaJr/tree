import { Injectable, Logger } from '@nestjs/common';
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
    this.deleteZip(path, true);
    this.deleteZip(systemConfig.FRONTEND, false);
    this.updateAppFiles();
  };

  private deleteZip = (path: string, zip: boolean) => {
    try {
      rmSync(path, { recursive: true });
    } catch (e) {
      Logger.warn(`Failed to delete ${zip ? 'zip' : 'app'} ${e.message}`);
    }
  };

  private updateAppFiles = () => {
    try {
      renameSync(`${systemConfig.TMP}/app`, systemConfig.FRONTEND);
    } catch (e) {
      Logger.warn(`Failed to rename app ${e.message}`);
    }
  };
}
