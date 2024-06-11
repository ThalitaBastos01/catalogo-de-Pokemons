create table usuarios (
	id serial primary key,
  nome text not null,
  email text unique not null,
  senha integer not null
)

create table pokemons (
	id serial primary key,
  usuario_id integer not null references usuarios(id),
  nome text not null,
  habilidades text not null,
  imagem integer,
  apelido text
)
