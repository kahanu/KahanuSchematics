import { Injectable } from '@angular/core';
import { HttpBase } from 'src/app/core/http-base';
import { ExceptionService } from 'src/app/core/services/exception.service';
import { HttpClient } from '@angular/common/http';
import { Entity } from 'src/app/core/models/base';

export class <%= classify(name) %> extends Entity {}

@Injectable({
  providedIn: 'root'
})
export class <%= classify(name) %>Service extends HttpBase<<%= classify(name) %>> {
  constructor(
    protected http: HttpClient,
    protected exceptionService: ExceptionService
  ) {
    super(http, exceptionService);
  }

  /** Add any custom service methods here. */
}
