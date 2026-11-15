# ADR 0001: Modular monolith foundation

- Status: accepted
- Decision: use a pnpm workspace with a React/Vite web app and one Express API. Organize API feature code by module and layer, with Awilix composition at the API boundary.
- Consequences: no service-to-service network boundary or worker is introduced. Domain and application code can remain framework independent as modules are added.
