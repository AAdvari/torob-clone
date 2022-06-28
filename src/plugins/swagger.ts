import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { AppModule } from '../app.module';

export const enableSwagger = (app) => {
    let modules = [];

    app.select(AppModule).contextModule._imports.forEach((module) => {
        modules.push(module);
    });
    modules = modules
        .filter((module) => module._controllers?.size)
        .sort((a, b) => (a._metatype.name <= b._metatype.name ? -1 : 1))
        .map((module) => module);
    const publicPath = './dist/public/';
    const { version } = JSON.parse(readFileSync('package.json', 'utf-8'));
    if (!existsSync(publicPath)) {
        mkdirSync(publicPath);
    }

    const options = new DocumentBuilder()
        .setVersion(`v${version}`)
        .addBearerAuth()
        .build();

    let swaggerElements = ``;
    modules.forEach((module) => {
        const routeName = module._metatype.name.toString().replace('Module', '').toLowerCase();
        swaggerElements += `
           <a class="grid-item" style="font-size: 1.3rem; text-decoration-line: none;" href="${routeName}">
           <button class="btn" >
               ${module._metatype.name.replace('Module', '')}
             </button>
           </a>`;
        const document = SwaggerModule.createDocument(app, options, {
            include: [module._metatype],
        });
        SwaggerModule.setup('swagger/' + routeName, app, document);
    });
    const element = `<html lang="en">
    <head>
      <title>Swagger Menu</title>
      <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />

      <style>
      .grid-container {
        display: flex;
        flex-wrap: wrap;
        align-content: space-around;
        text-align: center;
      }
      .grid-item {
        padding: 10px;
        font-size: 1.2rem;
        flex: 20%;
      }
      .btn {
        border-radius: 8px;
        height: 100%;
        width: 100%;
        padding: 0.5rem 0;
        cursor: pointer;
        background-color: #e0e0e0;
        color: #2e2e2e;
        position: relative;
        font-weight: bold;
        font-size: 0.95rem;
        line-height: 60px;
        text-align: center;
        text-decoration:none;
        letter-spacing: 0.065em;
        transition: 0.4s;
      }
      .btn:hover {
        background-color: #2e2e2e;
        color: #e0e0e0;
      }
      </style>
    </head>
    <body style="margin: 1rem 10rem">
      <h1 style="text-align: center; margin: 32px 0">Swagger Menu</h1>
      <div class="grid-container">
          ${swaggerElements.replace('Module', '')}
      </div>
    </body>
    </html>`;
    const appDocument = SwaggerModule.createDocument(app, options);
    writeFileSync('./dist/public/swagger.json', JSON.stringify(appDocument, null, 4));
    if (!existsSync('./dist/swagger')) {
        mkdirSync('./dist/swagger');
    }
    writeFileSync('./dist/swagger/index.html', element);
};
