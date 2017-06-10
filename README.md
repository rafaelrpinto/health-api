# Overview
Node.js api with methods for searching health facilities based on government data. The api accesses the Redis database created by [health-db](https://github.com/rafaelrpinto/health-db).

By using Redis as our database we can take advantage of it's speed to create cost-effective apis / apps that can be accessed by a large number of clients requiring as few resources as possible. See more in [How fast is redis?](https://redis.io/topics/benchmarks)

## Routes

- GET /db_version

Retrieves the version of the database. Clients should use this value to determine if their cache is stale.

```javascript
{
  "version": "1495712237519"
}
```

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

Retrieves all the cities within a state. Ex: `/cities/RJ`

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

Retrieves the details of a facility by it's id. Ex: `/facility/5740576`

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

- GET /service/{service}/{state}/{page}

Retrieves the facilities that provide a specific service on a state. All the requests must inform a page.
Ex: `/service/1/RJ/1`

```javascript
{
  "totalCount": 153,
  "page": "1",
  "pageSize": 10,
  "rows": [...]
}
```

- GET /service/{service}/{state}/{city}/{page}

Retrieves the facilities that provide a specific service on a city. All the requests must inform a page.
Ex: `/service/1/RJ/37/1`

```javascript
{
  "totalCount": 65,
  "page": "1",
  "pageSize": 10,
  "rows": [...]
}
```

- GET /facility/nearest/{lat}/{long}

Retrieves the complete details of the nearest facilities from the provided coordinates.
Ex: `/facility/nearest/-22.933380/-43.244348`

```javascript
[
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
  },
  {...},
  {...},
  ...
]
```

- GET /facility/nearest/id/{lat}/{long}

Retrieves all the facility ids within 2km of the provided coordinates.
Ex: `/facility/nearest/id/-22.933380/-43.244348`

```javascript
[
  {
    "id": "2270099",
    "longitude": "-43.25493067502975464",
    "latitude": "-22.94417046563879836"
  },
  {
    "id": "3357988",
    "longitude": "-43.24863821268081665",
    "latitude": "-22.93962064115778432"
  },
  {
    "id": "3503496",
    "longitude": "-43.24863821268081665",
    "latitude": "-22.93962064115778432"
  },
  ...
]
```
