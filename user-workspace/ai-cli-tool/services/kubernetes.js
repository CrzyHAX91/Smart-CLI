import fs from 'fs/promises';

export class KubernetesService {
  constructor() {}

  async generateDeployment(name, image, replicas = 1) {
    const deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: name,
        labels: {
          app: name
        }
      },
      spec: {
        replicas: replicas,
        selector: {
          matchLabels: {
            app: name
          }
        },
        template: {
          metadata: {
            labels: {
              app: name
            }
          },
          spec: {
            containers: [
              {
                name: name,
                image: image,
                ports: [{ containerPort: 80 }]
              }
            ]
          }
        }
      }
    };

    return this._writeYAMLToFile(`${name}-deployment.yaml`, deployment);
  }

  async generateService(name, type = 'ClusterIP') {
    const service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: name
      },
      spec: {
        type: type,
        ports: [{ port: 80, targetPort: 80 }],
        selector: {
          app: name
        }
      }
    };

    return this._writeYAMLToFile(`${name}-service.yaml`, service);
  }

  async _writeYAMLToFile(filename, data) {
    const yaml = this._convertToYAML(data);
    await fs.writeFile(filename, yaml, 'utf8');
    return `${filename} has been created.`;
  }

  _convertToYAML(data) {
    return require('js-yaml').dump(data);
  }
}
