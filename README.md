# API POKEMON

Consuma a API e liste todos os pokemons da consulta do seguinte endpoint:
https://pokeapi.co/api/v2/pokemon

Exiba, de cada pokemon:
- imagem
- nome
- experiência

Você pode acessar as informações de cada pokemon individualmente em:
https://pokeapi.co/api/v2/pokemon/:id

### DICA:
imagem => sprites.front_default

experiência => base_experience

### EXTRA:
Se puder, ordene por nome.




## Explicação do algoritmo pensado

### Criar uma aplicação React:

    Utilizar vite para criação do projeto.

### Consumir a API do Pokémon:

    Fazer uma requisição HTTP ao endpoint https://pokeapi.co/api/v2/pokemon para obter a lista inicial de Pokémons.
    
    Para cada Pokémon retornado, fazer uma requisição adicional ao endpoint https://pokeapi.co/api/v2/pokemon/:id para obter suas informações detalhadas (imagem, nome e experiência).

### Exibir os dados:

    Para cada Pokémon, exibir o nome, imagem e experiência.

### Ordenar os Pokémons pelo nome:

    Implementar a lógica de ordenação por nome.

### Tratar o carregamento e erros:

    Adicionar estado para carregar enquanto a requisição está em andamento e exibir mensagem de erro se houver falhas.