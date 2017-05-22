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

- GET /facility/opening_hours

Retrieves all the facilities opening hours types.

```javascript
[
  {
    "id": "1",
    "description": "ATENDIMENTO COM TURNOS INTERMITENTES"
  },
  {
    "id": "2",
    "description": "ATENDIMENTOS NOS TURNOS DA MANHA E A TARDE"
  },
  {
    "id": "3",
    "description": "ATENDIMENTO NOS TURNOS DA MANHA, TARDE E NOITE"
  },
  ...
]
```

- GET /facility/services

Retrieves all the medical services avaialble on the facilities.

```javascript
[
  {
    "id": "1",
    "description": "SERVICO DE VIDEOLAPAROSCOPIA"
  },
  {
    "id": "2",
    "description": "SERVICO DE DIAGNOSTICO POR IMAGEM"
  },
  {
    "id": "3",
    "description": "SERVICO DE DIAGNOSTICO POR ANATOMIA PATOLOGICA EOU CITOPATO"
  },
  ...
]
```

- GET /cities/{state}

Retrieves all the cities within a state. Ex: /cities/RJ

```javascript
[
  {
    "id": "32",
    "description": "CANTAGALO"
  },
  {
    "id": "37",
    "description": "RIO DE JANEIRO"
  },
  {
    "id": "54",
    "description": "VALENCA"
  },
  ...
]
```

- GET /facility/{id}

Retrieves the details of a facility by it's id. Ex: /facility/5740576

```javascript
{
  "id": 5740576,
  "type": 10,
  "openingHours": 2,
  "services": [
    18,
    27,
    60,
    38,
    23
  ],
  "name": "UBSF VILA SAO JOSE SAO GERALDO",
  "businessName": "FUNDO MUNICIPAL DE SAUDE DE ARCOVERDE",
  "phone": "87 38219010",
  "latitude": -8.4180273,
  "longitude": -37.0532275,
  "address": {
    "street": "AVENIDA DOM PEDRO II",
    "number": "S/N",
    "neighborhood": "SAO GERALDO",
    "postalCode": "56506460",
    "state": "PE",
    "city": "ARCOVERDE",
    "cityId": 76
  }
}
```
