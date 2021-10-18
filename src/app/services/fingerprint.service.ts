import { Injectable } from "@angular/core";

import {
  FingerprintReader,
  SampleFormat,
  SamplesAcquired
} from "@digitalpersona/devices";

import base64url from "base64url";
import { Observable } from "rxjs";
import { loginFingerprintResponse, Raw } from "../models/fingerprint.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FingerPrintService {
  baseUrl: string = environment.fingerprintAPI;
  reader: FingerprintReader;
  devices: string[] = [];
  timeTnterval: number = 0;

  constructor( private http: HttpClient ) {
    this.reader = new FingerprintReader();
    this.countDevices();
  }

  countDevices() {
    this.timeTnterval = setInterval(() => {
      this.reader.enumerateDevices().then( async (devices) => {
        this.devices = devices;

        if (devices.length > 0) {
          await this.reader.startAcquisition(SampleFormat.Raw);
        }
      });
    }, 1500) as any;
  }

  async getDevices(): Promise<string[]> {
    return [...(await this.reader.enumerateDevices())];
  }

  async startAcquisition(sampleFormat: SampleFormat) {
    try {
      await this.reader.stopAcquisition();
      await this.reader.startAcquisition(sampleFormat);
    } catch (error) {
      console.error("Error en startAcquisition", error);
    }
  }

  stopAcquisition() {
    this.reader.stopAcquisition();
  }

  samplesAcquiredObservable(): Observable<Raw> {
    return new Observable((obs) => {
      this.reader.on("SamplesAcquired", (event: SamplesAcquired) => {
        const str64 = base64url.decode(event.samples[0].Data);
        const raw = JSON.parse(str64);

        obs.next(raw);
      });
    });
  }

  login( raw: Raw )
  {
    const url = `${this.baseUrl}api/authentication/identifyFingerprint`;
    const body = { raw };
    /* let headers = new HttpHeaders();
    headers.set('Access-Control-Allow-Origin', '*'); */

    return this.http.post<loginFingerprintResponse>(url, body);
  }
}
