# clamav

![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.0.5](https://img.shields.io/badge/AppVersion-1.0.5-informational?style=flat-square)

Chart for deploying a Clam AV on kubernetes

## Maintainers

| Name   | Email | Url                               |
| ------ | ----- | --------------------------------- |
| BC Gov |       | <https://github.com/bcgov/clamav> |

## Requirements

Kubernetes: `>= 1.18.0`

## Values

| Key                                               | Type   | Default                                                                                  | Description                                                                                                                  |
| ------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| clamav.freshclam.mirrors                          | list   | `["https://clamav-mirror.apps.silver.devops.gov.bc.ca"]`                                 | A list of clamav mirrors to be used by the clamav service. By default, use the ClamAV Mirror provided in OCP4 Silver cluster |
| clamav.image                                      | string | `"clamav/clamav"`                                                                        | The clamav docker image                                                                                                      |
| clamav.imagePullPolicy                            | string | `"IfNotPresent"`                                                                         | IfNotPresent                                                                                                                 |
| clamav.limits.connectionQueueLength               | int    | `100`                                                                                    | Maximum length the queue of pending connections may grow to                                                                  |
| clamav.limits.fileSize                            | int    | `30`                                                                                     | The largest file size scanable by clamav, in MB                                                                              |
| clamav.limits.maxThreads                          | int    | `4`                                                                                      | Maximum number of threads running at the same time.                                                                          |
| clamav.limits.scanSize                            | int    | `150`                                                                                    | The largest scan size permitted in clamav, in MB                                                                             |
| clamav.limits.sendBufTimeout                      | int    | `500`                                                                                    |                                                                                                                              |
| clamav.replicaCount                               | int    | `1`                                                                                      |                                                                                                                              |
| clamav.resources                                  | object | `{"limits":{"cpu":"500m","memory":"2048Mi"},"requests":{"cpu":"100m","memory":"512Mi"}}` | The resource requests and limits for the clamav service                                                                      |
| clamav.tag                                        | string | `"1.0.5"`                                                                                |                                                                                                                              |
| containerSecurityContext.allowPrivilegeEscalation | bool   | `false`                                                                                  |                                                                                                                              |
| containerSecurityContext.capabilities.drop[0]     | string | `"ALL"`                                                                                  |                                                                                                                              |
| containerSecurityContext.enabled                  | bool   | `true`                                                                                   |                                                                                                                              |
| containerSecurityContext.runAsNonRoot             | bool   | `true`                                                                                   |                                                                                                                              |
| containerSecurityContext.seccompProfile.type      | string | `"RuntimeDefault"`                                                                       |                                                                                                                              |
| fullnameOverride                                  | string | `""`                                                                                     | override the full name of the clamav chart                                                                                   |
| nameOverride                                      | string | `""`                                                                                     | override the name of the clamav chart                                                                                        |
| pdb.create                                        | bool   | `false`                                                                                  |                                                                                                                              |
| pdb.maxUnavailable                                | string | `""`                                                                                     |                                                                                                                              |
| pdb.minAvailable                                  | int    | `1`                                                                                      |                                                                                                                              |
| podSecurityContext.enabled                        | bool   | `true`                                                                                   |                                                                                                                              |
| podSecurityContext.seccompProfile.type            | string | `"RuntimeDefault"`                                                                       |                                                                                                                              |
| service.port                                      | int    | `3310`                                                                                   | The port to be used by the clamav service                                                                                    |

---

Autogenerated from chart metadata using [helm-docs v1.13.1](https://github.com/norwoodj/helm-docs/releases/v1.13.1)

## Additional Changes

| Key             | Type   | Default  | Description                         |
| --------------- | ------ | -------- | ----------------------------------- |
| nsp.role        | string | `app`    | Allow ingress from these pods only  |
| nsp.environment | string | `prod`   | Limit ingress to this namespace env |
| nsp.name        | string | `a12c97` | Limit ingress to this namespace     |
