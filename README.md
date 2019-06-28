# Custom Schematics

This custom schematics create several bits of code to save time building components or services.

## Current Schematics - as of 6/27/2019
-- Core - this schematic creates an entire folder with folders for guards, interceptors, entity models, and base services.
-- Service - this schematic create a service class similar to the normal Angular service schematic, but adds my custom HttpBase class that contains the basic CRUD operations using the HttpClient.

### Schematic Information

*Core* Schematic
| Parameter | Definition |
|---|---|
| project | (optional) the name of the project |
| -- workspaceHostProject | (optional) the name of the project in a workspace where the code should be rendered |

*Example* command line code

```javascript
ng g kahanu:core <project> --workspaceHostProject=demo-one
```

### Example 

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


 
 