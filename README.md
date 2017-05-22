# Overview
Node.js api with methods for searching health facilities based on government data. The api accesses the Redis database created by [health-db](https://github.com/rafaelrpinto/health-db).

## Routes

- GET /facility/types

Retrieves all the facility types.

```javascript
[
  {
    "id": "1",
    "description": "HOSPITAL/DIA - ISOLADO"
  },
  {
    "id": "2",
    "description": "CENTRAL DE GESTAO EM SAUDE"
  },
  {
    "id": "3",
    "description": "CLINICA/CENTRO DE ESPECIALIDADE"
  },
  ...
]
```

TODO: other routes
