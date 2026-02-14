import type {
  User, Church, Tournament, Team, Match, Question, Penalty, Permission, ActivityLog
} from "./types"

export const mockUsers: User[] = [
  { id: "u1", name: "Lucas Oliveira", email: "lucas@email.com", role: "admin", status: "active", church_id: "c1", age_group: "young_adults", denomination: "baptist", avatar_url: null, xp: 4850, total_correct: 312, total_wrong: 48, total_quizzes: 45, created_at: "2024-01-15" },
  { id: "u2", name: "Ana Souza", email: "ana@email.com", role: "supervisor", status: "active", church_id: "c2", age_group: "young_adults", denomination: "pentecostal", avatar_url: null, xp: 3920, total_correct: 256, total_wrong: 64, total_quizzes: 40, created_at: "2024-02-10" },
  { id: "u3", name: "Pedro Santos", email: "pedro@email.com", role: "user", status: "active", church_id: "c1", age_group: "teens", denomination: "baptist", avatar_url: null, xp: 2780, total_correct: 189, total_wrong: 51, total_quizzes: 30, created_at: "2024-03-05" },
  { id: "u4", name: "Maria Costa", email: "maria@email.com", role: "user", status: "active", church_id: "c3", age_group: "adults", denomination: "catholic", avatar_url: null, xp: 3150, total_correct: 201, total_wrong: 39, total_quizzes: 30, created_at: "2024-01-20" },
  { id: "u5", name: "Gabriel Lima", email: "gabriel@email.com", role: "user", status: "suspended", church_id: "c2", age_group: "teens", denomination: "pentecostal", avatar_url: null, xp: 1540, total_correct: 98, total_wrong: 42, total_quizzes: 18, created_at: "2024-04-12" },
  { id: "u6", name: "Juliana Ferreira", email: "juliana@email.com", role: "user", status: "active", church_id: "c4", age_group: "young_adults", denomination: "presbyterian", avatar_url: null, xp: 3600, total_correct: 230, total_wrong: 50, total_quizzes: 35, created_at: "2024-02-25" },
  { id: "u7", name: "Rafael Mendes", email: "rafael@email.com", role: "supervisor", status: "active", church_id: "c3", age_group: "adults", denomination: "catholic", avatar_url: null, xp: 4200, total_correct: 275, total_wrong: 45, total_quizzes: 40, created_at: "2024-01-05" },
  { id: "u8", name: "Camila Rocha", email: "camila@email.com", role: "user", status: "active", church_id: "c5", age_group: "young_adults", denomination: "methodist", avatar_url: null, xp: 2100, total_correct: 140, total_wrong: 60, total_quizzes: 25, created_at: "2024-05-01" },
  { id: "u9", name: "Thiago Almeida", email: "thiago@email.com", role: "user", status: "banned", church_id: "c1", age_group: "teens", denomination: "baptist", avatar_url: null, xp: 800, total_correct: 52, total_wrong: 28, total_quizzes: 10, created_at: "2024-06-15" },
  { id: "u10", name: "Isabela Martins", email: "isabela@email.com", role: "user", status: "active", church_id: "c4", age_group: "adults", denomination: "presbyterian", avatar_url: null, xp: 2950, total_correct: 192, total_wrong: 48, total_quizzes: 30, created_at: "2024-03-18" },
]

export const mockChurches: Church[] = [
  { id: "c1", name: "Igreja Batista Renovação", denomination: "baptist", city: "São Paulo", state: "SP", total_members: 45, total_points: 12500, tournaments_participated: 8, created_at: "2024-01-01" },
  { id: "c2", name: "Comunidade Pentecostal Vida Nova", denomination: "pentecostal", city: "Rio de Janeiro", state: "RJ", total_members: 38, total_points: 9800, tournaments_participated: 6, created_at: "2024-01-15" },
  { id: "c3", name: "Paróquia São Francisco", denomination: "catholic", city: "Belo Horizonte", state: "MG", total_members: 52, total_points: 11200, tournaments_participated: 7, created_at: "2024-02-01" },
  { id: "c4", name: "Igreja Presbiteriana Graça", denomination: "presbyterian", city: "Curitiba", state: "PR", total_members: 30, total_points: 8500, tournaments_participated: 5, created_at: "2024-02-15" },
  { id: "c5", name: "Igreja Metodista Esperança", denomination: "methodist", city: "Porto Alegre", state: "RS", total_members: 25, total_points: 6200, tournaments_participated: 4, created_at: "2024-03-01" },
]

export const mockTournaments: Tournament[] = [
  { id: "t1", name: "Copa Bíblica Nacional 2025", description: "O maior torneio bíblico do Brasil. Equipes de todo o país competem pelo título de campeão nacional.", status: "in_progress", start_date: "2025-02-01", end_date: "2025-03-15", age_group: "young_adults", denomination: "universal", team_size: 5, answer_time: 30, total_teams: 16, created_by: "u1", created_at: "2025-01-10" },
  { id: "t2", name: "Torneio Jovem Batista", description: "Competição entre jovens das igrejas batistas da região sudeste.", status: "upcoming", start_date: "2025-03-01", end_date: null, age_group: "teens", denomination: "baptist", team_size: 4, answer_time: 25, total_teams: 8, created_by: "u1", created_at: "2025-01-20" },
  { id: "t3", name: "Desafio Pentecostal RJ", description: "Torneio trimestral entre comunidades pentecostais do Rio de Janeiro.", status: "finished", start_date: "2024-11-01", end_date: "2024-12-20", age_group: "adults", denomination: "pentecostal", team_size: 5, answer_time: 30, total_teams: 12, created_by: "u2", created_at: "2024-10-15" },
  { id: "t4", name: "Liga Infantil Bíblica", description: "Competição amigável para crianças aprenderem a Bíblia de forma divertida.", status: "upcoming", start_date: "2025-04-10", end_date: null, age_group: "kids", denomination: "universal", team_size: 3, answer_time: 45, total_teams: 6, created_by: "u7", created_at: "2025-02-01" },
  { id: "t5", name: "Olimpíada Bíblica SP", description: "Competição anual entre igrejas de São Paulo.", status: "in_progress", start_date: "2025-01-15", end_date: "2025-02-28", age_group: "young_adults", denomination: "universal", team_size: 5, answer_time: 20, total_teams: 8, created_by: "u1", created_at: "2025-01-05" },
]

export const mockTeams: Team[] = [
  { id: "tm1", name: "Leões de Judá", tournament_id: "t1", church_id: "c1", church_name: "Igreja Batista Renovação", members: [{ id: "m1", user_id: "u1", name: "Lucas Oliveira", role: "captain" }, { id: "m2", user_id: "u3", name: "Pedro Santos", role: "player" }], points: 450, wins: 3, losses: 0 },
  { id: "tm2", name: "Guerreiros da Fé", tournament_id: "t1", church_id: "c2", church_name: "Comunidade Pentecostal Vida Nova", members: [{ id: "m3", user_id: "u2", name: "Ana Souza", role: "captain" }, { id: "m4", user_id: "u5", name: "Gabriel Lima", role: "player" }], points: 380, wins: 2, losses: 1 },
  { id: "tm3", name: "Estrelas de Belém", tournament_id: "t1", church_id: "c3", church_name: "Paróquia São Francisco", members: [{ id: "m5", user_id: "u4", name: "Maria Costa", role: "captain" }, { id: "m6", user_id: "u7", name: "Rafael Mendes", role: "player" }], points: 420, wins: 3, losses: 1 },
  { id: "tm4", name: "Soldados de Cristo", tournament_id: "t1", church_id: "c4", church_name: "Igreja Presbiteriana Graça", members: [{ id: "m7", user_id: "u6", name: "Juliana Ferreira", role: "captain" }, { id: "m8", user_id: "u10", name: "Isabela Martins", role: "player" }], points: 350, wins: 2, losses: 2 },
  { id: "tm5", name: "Arca de Noé", tournament_id: "t5", church_id: "c1", church_name: "Igreja Batista Renovação", members: [{ id: "m9", user_id: "u1", name: "Lucas Oliveira", role: "captain" }], points: 280, wins: 2, losses: 0 },
  { id: "tm6", name: "Filhos da Luz", tournament_id: "t5", church_id: "c5", church_name: "Igreja Metodista Esperança", members: [{ id: "m10", user_id: "u8", name: "Camila Rocha", role: "captain" }], points: 220, wins: 1, losses: 1 },
  { id: "tm7", name: "Escudo da Fé", tournament_id: "t1", church_id: "c5", church_name: "Igreja Metodista Esperança", members: [{ id: "m11", user_id: "u8", name: "Camila Rocha", role: "captain" }], points: 300, wins: 1, losses: 2 },
  { id: "tm8", name: "Centuriões", tournament_id: "t1", church_id: "c1", church_name: "Igreja Batista Renovação", members: [{ id: "m12", user_id: "u3", name: "Pedro Santos", role: "captain" }], points: 310, wins: 2, losses: 1 },
]

export const mockMatches: Match[] = [
  { id: "mt1", tournament_id: "t1", round: "Quartas de Final", team_a: { id: "tm1", name: "Leões de Judá", score: 8 }, team_b: { id: "tm4", name: "Soldados de Cristo", score: 5 }, status: "finished", scheduled_at: "2025-02-10T14:00:00", winner_id: "tm1" },
  { id: "mt2", tournament_id: "t1", round: "Quartas de Final", team_a: { id: "tm2", name: "Guerreiros da Fé", score: 6 }, team_b: { id: "tm3", name: "Estrelas de Belém", score: 7 }, status: "finished", scheduled_at: "2025-02-10T16:00:00", winner_id: "tm3" },
  { id: "mt3", tournament_id: "t1", round: "Semifinal", team_a: { id: "tm1", name: "Leões de Judá", score: 4 }, team_b: { id: "tm3", name: "Estrelas de Belém", score: 3 }, status: "in_progress", scheduled_at: "2025-02-14T14:00:00", winner_id: null },
  { id: "mt4", tournament_id: "t1", round: "Semifinal", team_a: { id: "tm7", name: "Escudo da Fé", score: 0 }, team_b: { id: "tm8", name: "Centuriões", score: 0 }, status: "scheduled", scheduled_at: "2025-02-14T16:00:00", winner_id: null },
  { id: "mt5", tournament_id: "t5", round: "Quartas de Final", team_a: { id: "tm5", name: "Arca de Noé", score: 7 }, team_b: { id: "tm6", name: "Filhos da Luz", score: 4 }, status: "finished", scheduled_at: "2025-01-20T15:00:00", winner_id: "tm5" },
]

export const mockQuestions: Question[] = [
  { id: "q1", text: "Quem construiu a arca conforme a ordem de Deus?", options: [{ label: "A", text: "Abraão" }, { label: "B", text: "Moisés" }, { label: "C", text: "Noé" }, { label: "D", text: "Davi" }], correct_option: "C", bible_reference: "Gênesis 6:14-22", difficulty: "easy", age_group: "kids", denomination: "universal", type: "multiple_choice", tags: ["Antigo Testamento", "Gênesis"], times_used: 150, times_correct: 130, created_by: "u1", created_at: "2024-01-10" },
  { id: "q2", text: "Quantos livros compõem o Novo Testamento?", options: [{ label: "A", text: "21" }, { label: "B", text: "27" }, { label: "C", text: "33" }, { label: "D", text: "39" }], correct_option: "B", bible_reference: "Estrutura Bíblica", difficulty: "easy", age_group: "teens", denomination: "universal", type: "multiple_choice", tags: ["Estrutura Bíblica", "Novo Testamento"], times_used: 200, times_correct: 160, created_by: "u1", created_at: "2024-01-12" },
  { id: "q3", text: "Qual é o maior mandamento segundo Jesus?", options: [{ label: "A", text: "Não matarás" }, { label: "B", text: "Honrar pai e mãe" }, { label: "C", text: "Amar a Deus sobre todas as coisas" }, { label: "D", text: "Não cobiçarás" }], correct_option: "C", bible_reference: "Mateus 22:37-38", difficulty: "medium", age_group: "young_adults", denomination: "universal", type: "multiple_choice", tags: ["Novo Testamento", "Mateus", "Mandamentos"], times_used: 180, times_correct: 120, created_by: "u2", created_at: "2024-01-15" },
  { id: "q4", text: "Em qual cidade Jesus nasceu?", options: [{ label: "A", text: "Nazaré" }, { label: "B", text: "Jerusalém" }, { label: "C", text: "Belém" }, { label: "D", text: "Cafarnaum" }], correct_option: "C", bible_reference: "Mateus 2:1", difficulty: "easy", age_group: "kids", denomination: "universal", type: "multiple_choice", tags: ["Novo Testamento", "Mateus", "Jesus"], times_used: 250, times_correct: 220, created_by: "u1", created_at: "2024-01-18" },
  { id: "q5", text: "Quem escreveu a maioria das epístolas do Novo Testamento?", options: [{ label: "A", text: "Pedro" }, { label: "B", text: "João" }, { label: "C", text: "Tiago" }, { label: "D", text: "Paulo" }], correct_option: "D", bible_reference: "Epístolas Paulinas", difficulty: "medium", age_group: "teens", denomination: "universal", type: "multiple_choice", tags: ["Novo Testamento", "Epístolas", "Paulo"], times_used: 160, times_correct: 100, created_by: "u2", created_at: "2024-02-01" },
  { id: "q6", text: "Qual profeta foi engolido por um grande peixe?", options: [{ label: "A", text: "Elias" }, { label: "B", text: "Jonas" }, { label: "C", text: "Daniel" }, { label: "D", text: "Isaías" }], correct_option: "B", bible_reference: "Jonas 1:17", difficulty: "easy", age_group: "kids", denomination: "universal", type: "multiple_choice", tags: ["Antigo Testamento", "Jonas", "Profetas"], times_used: 190, times_correct: 170, created_by: "u7", created_at: "2024-02-05" },
  { id: "q7", text: "Qual é o fruto do Espírito mencionado primeiro em Gálatas 5:22?", options: [{ label: "A", text: "Paz" }, { label: "B", text: "Amor" }, { label: "C", text: "Alegria" }, { label: "D", text: "Bondade" }], correct_option: "B", bible_reference: "Gálatas 5:22", difficulty: "medium", age_group: "young_adults", denomination: "universal", type: "multiple_choice", tags: ["Novo Testamento", "Gálatas", "Espírito Santo"], times_used: 140, times_correct: 85, created_by: "u2", created_at: "2024-02-10" },
  { id: "q8", text: "Quantos dias durou o dilúvio segundo Gênesis?", options: [{ label: "A", text: "7 dias" }, { label: "B", text: "40 dias e 40 noites" }, { label: "C", text: "100 dias" }, { label: "D", text: "12 dias" }], correct_option: "B", bible_reference: "Gênesis 7:12", difficulty: "medium", age_group: "teens", denomination: "universal", type: "multiple_choice", tags: ["Antigo Testamento", "Gênesis", "Dilúvio"], times_used: 175, times_correct: 130, created_by: "u1", created_at: "2024-02-15" },
  { id: "q9", text: "Em que livro da Bíblia encontramos o Sermão do Monte?", options: [{ label: "A", text: "Lucas" }, { label: "B", text: "Marcos" }, { label: "C", text: "Mateus" }, { label: "D", text: "João" }], correct_option: "C", bible_reference: "Mateus 5-7", difficulty: "hard", age_group: "adults", denomination: "universal", type: "multiple_choice", tags: ["Novo Testamento", "Mateus", "Sermão do Monte"], times_used: 120, times_correct: 60, created_by: "u7", created_at: "2024-03-01" },
  { id: "q10", text: "Qual dos seguintes NÃO é um dos 12 apóstolos originais?", options: [{ label: "A", text: "Bartolomeu" }, { label: "B", text: "Paulo" }, { label: "C", text: "Tadeu" }, { label: "D", text: "Filipe" }], correct_option: "B", bible_reference: "Mateus 10:2-4", difficulty: "hard", age_group: "adults", denomination: "universal", type: "multiple_choice", tags: ["Novo Testamento", "Apóstolos"], times_used: 100, times_correct: 45, created_by: "u1", created_at: "2024-03-10" },
  { id: "q11", text: "Quem foi vendido pelos irmãos como escravo?", options: [{ label: "A", text: "Davi" }, { label: "B", text: "José" }, { label: "C", text: "Benjamin" }, { label: "D", text: "Rúben" }], correct_option: "B", bible_reference: "Gênesis 37:28", difficulty: "easy", age_group: "kids", denomination: "universal", type: "multiple_choice", tags: ["Antigo Testamento", "Gênesis", "José"], times_used: 180, times_correct: 155, created_by: "u2", created_at: "2024-03-15" },
  { id: "q12", text: "Qual rei de Israel era conhecido por sua grande sabedoria?", options: [{ label: "A", text: "Davi" }, { label: "B", text: "Salomão" }, { label: "C", text: "Saul" }, { label: "D", text: "Josias" }], correct_option: "B", bible_reference: "1 Reis 3:12", difficulty: "easy", age_group: "teens", denomination: "universal", type: "multiple_choice", tags: ["Antigo Testamento", "Reis", "Salomão"], times_used: 165, times_correct: 140, created_by: "u7", created_at: "2024-03-20" },
]

export const mockPenalties: Penalty[] = [
  { id: "p1", user_id: "u5", user_name: "Gabriel Lima", type: "suspension", reason: "Comportamento inadequado durante torneio", applied_by: "u1", applied_at: "2025-01-15", expires_at: "2025-03-15" },
  { id: "p2", user_id: "u9", user_name: "Thiago Almeida", type: "ban", reason: "Múltiplas violações de conduta", applied_by: "u1", applied_at: "2025-01-20", expires_at: null },
]

export const mockPermissions: Permission[] = [
  { role: "admin", module: "Quiz", actions: { view: true, create: true, edit: true, delete: true } },
  { role: "admin", module: "Torneios", actions: { view: true, create: true, edit: true, delete: true } },
  { role: "admin", module: "Igrejas", actions: { view: true, create: true, edit: true, delete: true } },
  { role: "admin", module: "Perguntas", actions: { view: true, create: true, edit: true, delete: true } },
  { role: "admin", module: "Usuários", actions: { view: true, create: true, edit: true, delete: true } },
  { role: "admin", module: "Penalidades", actions: { view: true, create: true, edit: true, delete: true } },
  { role: "supervisor", module: "Quiz", actions: { view: true, create: true, edit: true, delete: false } },
  { role: "supervisor", module: "Torneios", actions: { view: true, create: true, edit: true, delete: false } },
  { role: "supervisor", module: "Igrejas", actions: { view: true, create: false, edit: true, delete: false } },
  { role: "supervisor", module: "Perguntas", actions: { view: true, create: true, edit: true, delete: false } },
  { role: "supervisor", module: "Usuários", actions: { view: true, create: false, edit: false, delete: false } },
  { role: "supervisor", module: "Penalidades", actions: { view: true, create: true, edit: false, delete: false } },
  { role: "user", module: "Quiz", actions: { view: true, create: true, edit: false, delete: false } },
  { role: "user", module: "Torneios", actions: { view: true, create: false, edit: false, delete: false } },
  { role: "user", module: "Igrejas", actions: { view: true, create: false, edit: false, delete: false } },
  { role: "user", module: "Perguntas", actions: { view: true, create: false, edit: false, delete: false } },
  { role: "user", module: "Usuários", actions: { view: false, create: false, edit: false, delete: false } },
  { role: "user", module: "Penalidades", actions: { view: false, create: false, edit: false, delete: false } },
]

export const mockActivityLog: ActivityLog[] = [
  { id: "a1", user_name: "Lucas Oliveira", action: "criou torneio", target: "Copa Bíblica Nacional 2025", timestamp: "2025-02-14T10:30:00" },
  { id: "a2", user_name: "Ana Souza", action: "adicionou pergunta", target: "Qual é o fruto do Espírito...", timestamp: "2025-02-14T09:15:00" },
  { id: "a3", user_name: "Lucas Oliveira", action: "aplicou penalidade", target: "Gabriel Lima - Suspensão", timestamp: "2025-02-13T16:45:00" },
  { id: "a4", user_name: "Rafael Mendes", action: "inscreveu equipe", target: "Estrelas de Belém no Copa Bíblica", timestamp: "2025-02-13T14:20:00" },
  { id: "a5", user_name: "Juliana Ferreira", action: "finalizou quiz", target: "Quiz Individual - 9/10 acertos", timestamp: "2025-02-13T11:00:00" },
  { id: "a6", user_name: "Maria Costa", action: "registrou resultado", target: "Leões de Judá 8 x 5 Soldados de Cristo", timestamp: "2025-02-12T17:30:00" },
  { id: "a7", user_name: "Pedro Santos", action: "completou quiz", target: "Quiz Individual - 7/10 acertos", timestamp: "2025-02-12T15:00:00" },
  { id: "a8", user_name: "Camila Rocha", action: "cadastrou igreja", target: "Igreja Metodista Esperança", timestamp: "2025-02-11T09:00:00" },
]
