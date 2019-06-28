# Custom Schematics

This custom schematics create several bits of code to save time building components or services.

**IMPORTANT** - this schematic is still in Alpha and is NOT in NPM yet.  If you want to learn about how to build your own custom schematic, you can clone this project and see how these schematics are built.  I will update this documentation when this package has been added to NPM to be used in production.

## Current Schematics - as of 6/27/2019
+ Core - this schematic creates an entire folder with folders for guards, interceptors, entity models, and base services.
+ Service - this schematic create a service class similar to the normal Angular service schematic, but adds my custom HttpBase class that contains the basic CRUD operations using the HttpClient.

### Schematic Information

**Core** Schematic

The Core Schematic contains many classes that create interceptors, models and services for your RESTful Angular project.  It also contains an HttpBase class that implements the RESTful CRUD operations. This base class will be implemented by the generated Service classes.

| Parameter | Definition |
|---|---|
| project | (optional) the name of the project |
| -- workspaceHostProject | (optional) the name of the project in a workspace where the code should be rendered |

*Example* command line code

```javascript
ng g kahanu:core <project> --workspaceHostProject=demo-one
```

### Core Example 

Here are examples of how to generate the schematics.

*Core* in an Angular application

This will place the Core folder inside the 'app' folder of the application.

```javascript
ng g kahanu:core
```

The ```project``` parameter is optional and will be the Angular project.


*Core* in a Workspace

To produce the Core schematics in a Library project called 'shared-libs', and update the app.module.ts file of the host Angular project (demo-two), this would be the command.

```javascript
ng g kahanu:core shared-libs --workspaceHostProject=demo-two
```

**Service** Schematic

The service schematic generates a Service that depends on the Core Schematic being in place first.  It uses the HttpBase class that is produced in the Core schematic.

| Parameter | Definition |
|---|---|
| name | (optional) The name of the service (without the suffix `Service`) |
| project | (optional) The name of the project to render the service. |
| lintFix | (default: false) Specifies whether to apply lint fixes after generating the pipe. |

*Example* command line code

```javascript
ng g kahanu:service <name> --<project> --lintFix=true
```

### Sample Service Code

If you want to create a **Customer** service in the '/customer' folder, you would enter this command:

```javascript
ng g kahanu:service Customer
```

If you want to create a **Customer** service in the `Core/services` folder, you would enter this command:

```javascript
ng g kahanu:service core/services/Customer
```

The service schematic produces a service class like below.

```javascript
import { Injectable } from '@angular/core';
import { HttpBase } from '../http-base';
import { HttpClient } from '@angular/common/http';
import { ExceptionService } from './exception.service';
import { Customer } from 'src/app/shared/entities/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends HttpBase<Customer> {

  constructor(protected http: HttpClient,
    protected exceptionService: ExceptionService) {
    super(http, exceptionService);
  }

}

```



 
 
