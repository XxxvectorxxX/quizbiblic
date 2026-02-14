-- Seed churches
insert into public.churches (id, name, denomination, city, state, total_members, total_points, tournaments_participated) values
  ('c1000000-0000-0000-0000-000000000001', 'Igreja Batista Central', 'baptist', 'Sao Paulo', 'SP', 45, 12500, 8),
  ('c1000000-0000-0000-0000-000000000002', 'Assembleia de Deus Esperanca', 'assembly_of_god', 'Rio de Janeiro', 'RJ', 78, 23400, 15),
  ('c1000000-0000-0000-0000-000000000003', 'Igreja Presbiteriana Renovada', 'presbyterian', 'Belo Horizonte', 'MG', 32, 8900, 5),
  ('c1000000-0000-0000-0000-000000000004', 'Comunidade Metodista Graca', 'methodist', 'Curitiba', 'PR', 28, 7200, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Igreja Pentecostal Chama Viva', 'pentecostal', 'Salvador', 'BA', 55, 15800, 10)
on conflict (id) do nothing;

-- Seed questions
insert into public.questions (id, question, options, correct_answer, category, difficulty, explanation, bible_reference) values
  (gen_random_uuid(), 'Quem construiu a arca?', '["Abraao", "Noe", "Moises", "Davi"]', 1, 'old_testament', 'easy', 'Noe foi instruido por Deus a construir a arca para salvar sua familia e os animais do diluvio.', 'Genesis 6:14'),
  (gen_random_uuid(), 'Quantos discipulos Jesus tinha?', '["10", "11", "12", "13"]', 2, 'gospels', 'easy', 'Jesus escolheu 12 discipulos para segui-lo e espalhar sua mensagem.', 'Mateus 10:1-4'),
  (gen_random_uuid(), 'Qual o primeiro livro da Biblia?', '["Exodo", "Genesis", "Levitico", "Salmos"]', 1, 'old_testament', 'easy', 'Genesis e o primeiro livro da Biblia e narra a criacao do mundo.', 'Genesis 1:1'),
  (gen_random_uuid(), 'Quem matou Golias?', '["Saul", "Jonatas", "Davi", "Samuel"]', 2, 'old_testament', 'easy', 'Davi, ainda jovem, derrotou o gigante Golias com uma funda e uma pedra.', '1 Samuel 17:50'),
  (gen_random_uuid(), 'Qual o ultimo livro da Biblia?', '["Judas", "Apocalipse", "Malaquias", "Atos"]', 1, 'revelation', 'easy', 'Apocalipse e o ultimo livro da Biblia, escrito pelo apostolo Joao.', 'Apocalipse 1:1'),
  (gen_random_uuid(), 'Quem foi jogado na cova dos leoes?', '["Elias", "Daniel", "Jonas", "Jeremias"]', 1, 'prophets', 'medium', 'Daniel foi lancado na cova dos leoes por orar ao Deus verdadeiro.', 'Daniel 6:16'),
  (gen_random_uuid(), 'Qual o salmo mais conhecido?', '["Salmo 1", "Salmo 23", "Salmo 91", "Salmo 119"]', 1, 'psalms', 'medium', 'O Salmo 23, conhecido como o Salmo do Bom Pastor, e um dos mais queridos.', 'Salmos 23'),
  (gen_random_uuid(), 'Quantos livros tem o Novo Testamento?', '["25", "27", "29", "31"]', 1, 'new_testament', 'medium', 'O Novo Testamento possui 27 livros.', 'Novo Testamento'),
  (gen_random_uuid(), 'Quem escreveu a maior parte das epistolas?', '["Pedro", "Joao", "Paulo", "Tiago"]', 2, 'new_testament', 'medium', 'O apostolo Paulo escreveu 13 das 21 epistolas do Novo Testamento.', 'Epistolas Paulinas'),
  (gen_random_uuid(), 'Em qual monte Moises recebeu os Dez Mandamentos?', '["Monte Carmelo", "Monte Sinai", "Monte das Oliveiras", "Monte Siao"]', 1, 'old_testament', 'medium', 'Moises recebeu as tabuas da Lei no Monte Sinai.', 'Exodo 19:20'),
  (gen_random_uuid(), 'Qual era a profissao de Jesus antes do ministerio?', '["Pescador", "Carpinteiro", "Pastor", "Agricultor"]', 1, 'gospels', 'medium', 'Jesus era conhecido como carpinteiro, seguindo a profissao de Jose.', 'Marcos 6:3'),
  (gen_random_uuid(), 'Quem traiu Jesus?', '["Pedro", "Tome", "Judas Iscariotes", "Andre"]', 2, 'gospels', 'easy', 'Judas Iscariotes traiu Jesus por 30 moedas de prata.', 'Mateus 26:14-16'),
  (gen_random_uuid(), 'Qual a primeira praga do Egito?', '["Trevas", "Sangue", "Ras", "Gafanhotos"]', 1, 'old_testament', 'hard', 'A primeira praga transformou as aguas do Nilo em sangue.', 'Exodo 7:20'),
  (gen_random_uuid(), 'Quem foi o primeiro rei de Israel?', '["Davi", "Salomao", "Saul", "Roboao"]', 2, 'old_testament', 'hard', 'Saul foi ungido por Samuel como o primeiro rei de Israel.', '1 Samuel 10:1'),
  (gen_random_uuid(), 'Quantos dias Jesus jejuou no deserto?', '["7", "21", "30", "40"]', 3, 'gospels', 'medium', 'Jesus jejuou 40 dias e 40 noites no deserto antes de ser tentado.', 'Mateus 4:2')
on conflict do nothing;

-- Seed tournaments
insert into public.tournaments (id, name, description, start_date, end_date, status, max_participants, current_participants, age_group) values
  (gen_random_uuid(), 'Torneio Genesis', 'Teste seus conhecimentos sobre o livro de Genesis', now() + interval '7 days', now() + interval '14 days', 'upcoming', 50, 0, 'all'),
  (gen_random_uuid(), 'Desafio dos Evangelhos', 'Perguntas sobre Mateus, Marcos, Lucas e Joao', now() - interval '1 day', now() + interval '6 days', 'active', 30, 12, 'young_adults'),
  (gen_random_uuid(), 'Copa Biblica Juvenil', 'Torneio especial para jovens', now() + interval '14 days', now() + interval '21 days', 'upcoming', 40, 0, 'teens')
on conflict do nothing;
