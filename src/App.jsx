import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './App.css';

// URL base da API para obter a lista de Pokémons
const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=48';
// Quando acessamos essa url encontramos apenas duas características dentro do atributo results: name e url
// Logo, para fazer a requisição de imagem e experiência precisaremos acessar a url individual via :id do pokemon.

export default function App() {

  const [pokemonList, setPokemonList] = useState([]);   // Para armazenar os resultados da lista de pokemons
  const [loading, setLoading] = useState(true);         // Para controlar o carregamento da página
  const [error, setError] = useState(null);             // Para tratar possíveis erros

  // Para cada Pokémon retornado, fazer uma requisição adicional ao endpoint https://pokeapi.co/api/v2/pokemon/:id para obter suas informações detalhadas (imagem, nome e experiência).
  // Consumir a API do Pokémon:
  useEffect(() => {
    // Função assíncrona para buscar dados dos pokémons
    const fetchPokemonData = async () => {
      try {
        // Fazer uma requisição HTTP ao endpoint https://pokeapi.co/api/v2/pokemon para obter a lista inicial de Pokémons.
        const response = await axios.get(POKEMON_API_URL);

        const sortedArray = [...response.data.results];
        // Atribuição do objeto original (response) a um segundo objeto (sortedArray) para que o segunda possa ser manipulado conforme interesse.
        // Faz-se isso porque não é indicado editar os dados do objeto inicial com os dados recebidos da API.
        // O trecho const sortedArray = [...response.data.results]; cria uma cópia da array results, garantindo que a array original não seja modificada diretamente. 
        // Isso segue os princípios da imutabilidade, que são importantes para evitar efeitos colaterais indesejados em JavaScript.

        // Ordenação do sortedArray
        // Ordena os pokémons por nome antes de buscar detalhes individuais
        sortedArray.sort((a, b) => a.name.localeCompare(b.name));

        const pokemonDetails = await Promise.all(
          // Promise.all é uma função que recebe um array de Promises e retorna uma única Promise que se resolve quando todas as Promises no array são resolvidas.
          // Não usar essa opção deixa o código vulnerável a velocidade da rede, disponibilidade da api entre outras coisas.
          // Sem isso, o que pode acontecer é carregar cada pokemon de uma vez, apresentando um de cada vez ao invés de todos juntos, como é o esperado para uma SPA.
          sortedArray.map(async (pokemon) => {
            const detailResponse = await axios.get(pokemon.url);
            return detailResponse.data;
          })
        );
        
        setPokemonList(pokemonDetails); // Armazena a lista de pokémons no estado
        setLoading(false);  // Indica que os dados foram carregados
      } catch (err) {
        setError(err);      // Caso ocorra um erro, armazena no estado
        setLoading(false);  // Para o estado de carregamento
      }
    };

    fetchPokemonData();
  }, []);

  // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading) return <div>Carregando...</div>;

  // Exibe uma mensagem de erro, caso ocorra
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="App">
      <h1>Pokémons</h1>
      <hr />
      <div className="pokemon-container">
        {pokemonList.map((pokemon) => (
          <Pokemon key={pokemon.id} data={pokemon} />
        ))}
      </div>
    </div>
  );
};

// Componente para renderizar os detalhes de cada Pokémon
const Pokemon = ({ data }) => {
  // O componente Pokemon recebe os dados completos como prop e renderiza as informações
  return (
    <div className="pokemon-card">
      <img
        src={data.sprites.front_default}
        alt={`Imagem do ${data.name}`}
      />
      <span>
        <h3>{data.name}</h3>
        <div>EXP: {data.base_experience}</div>
      </span>
    </div>
  );
};

// *********************************************
// Definindo PropTypes para o componente Pokemon
Pokemon.propTypes = {
  // O prop "data" é obrigatório e deve ser um objeto
  data: PropTypes.shape({

    
    sprites: PropTypes.shape({                    // A propriedade "sprites" deve ser um objeto com "front_default" como string
      front_default: PropTypes.string.isRequired, // Garante que "front_default" é uma string obrigatória
    }).isRequired,                                // "sprites" é um objeto obrigatório
    
    name: PropTypes.string.isRequired,            // A propriedade "name" deve ser uma string obrigatória
    base_experience: PropTypes.number.isRequired, // A propriedade "base_experience" deve ser um número obrigatório
  }).isRequired,                                  // "data" é um objeto obrigatório
};

// PropTypes permite validar as propriedades (props) que o componente recebe. 
//    Isso é útil para garantir que os dados estão no formato correto, especialmente quando lidamos com APIs externas que podem retornar dados incompletos ou inesperados.

// Uso do PropTypes.shape: 
//     É usado para definir a estrutura de objetos complexos. 
//     No caso, sprites é um objeto que contém a propriedade front_default (a URL da imagem do Pokémon). 
//     name é uma string que contém o nome do Pokémon, e base_experience é um número.

// .isRequired: 
//     Usado para garantir que a propriedade é obrigatória. 
//     Se a API não retornar essas informações, o React emitirá um aviso no console, ajudando a depurar problemas.



// *****************************************************************************************
// Percebeu que depois do componente App ainda teve outros dois? Pokemon e Pokemon.propTypes
// Aqui, vamos tratar do componente Pokemon, mas o mesmo se aplica ao Pokemon.propTypes.

// O motivo pelo qual o componente Pokemon foi definido depois do return do componente App está relacionado à ordem de definição de funções em JavaScript e à modularidade no React. 
// Vou explicar isso em detalhes:

// 1. Ordem das Definições de Funções
// Em JavaScript, a ordem em que as funções são definidas em um arquivo não afeta seu comportamento, contanto que a função seja definida antes de ser utilizada. 
// Nesse caso, o componente Pokemon é definido depois do return de App, mas isso não é um problema porque o Pokemon é chamado dentro do JSX de App e, até o momento em que é necessário, a função já está disponível.


// 2. Modularidade e Legibilidade
// Colocar o componente Pokemon após o return do App pode ser uma escolha de estilo para manter o foco do componente principal (App) nas operações que ele realiza (ex: fazer requisições, tratar estados) antes de mergulhar nos detalhes de componentes menores.
// Componentes menores depois: 
// - Colocar componentes menores no final do arquivo é uma convenção usada por alguns desenvolvedores para manter a clareza e o foco no componente principal primeiro. 
// - O App é o "componente pai" que faz o trabalho principal, enquanto o Pokemon é um componente auxiliar. 
//   Manter o componente auxiliar depois pode tornar a estrutura mais organizada, pois o fluxo principal de lógica vem primeiro.


// 3. Semântica e Clareza
// O código é mais legível quando você entende rapidamente o que o componente principal (App) faz: ele gerencia o estado da lista de Pokémons e o fluxo de dados, enquanto o componente Pokemon se preocupa apenas com a apresentação dos detalhes de cada Pokémon. Separar esses dois papéis ajuda a organizar o código, e defini-los nesta ordem (App primeiro) é uma escolha para manter esse fluxo lógico.
// É possível alterar a ordem?
// Sim! Podemos definir o componente Pokemon antes do App sem nenhum problema. 
// A funcionalidade continuará a mesma, pois o JavaScript lê todo o código antes de executar. 
// No entanto, colocar os componentes menores após o principal pode ser preferível por questões de legibilidade e estrutura de código.