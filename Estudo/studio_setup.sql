-- Create Brand: Cenbrap
INSERT INTO brands (id, name, description, created_at) VALUES 
('brand_cenbrap_001', 'Cenbrap', 'Cliente Cenbrap - Análise de Concorrência', datetime('now'));

-- Create Product: Inteligência Competitiva
INSERT INTO products (id, brand_id, name, description, status, created_at) VALUES 
('prod_cenbrap_intel_001', 'brand_cenbrap_001', 'Inteligência Competitiva', 'Análise de concorrência e mapeamento de mercado', 'active', datetime('now'));

-- Create Project: Análise Concorrência 2024
INSERT INTO projects (id, product_id, name, description, status, start_date, target_date, created_at) VALUES 
('proj_cenbrap_conc_001', 'prod_cenbrap_intel_001', 'Análise Concorrência 2024', 'Dossiê completo de 20 players do mercado', 'active', date('now'), date('now', '+10 days'), datetime('now'));

-- Create Sprints
INSERT INTO sprints (id, project_id, name, description, status, start_date, end_date, sequence, created_at) VALUES 
('sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Sprint 1: Scraping Sites', 'Extração de dados de 20 sites concorrentes', 'active', date('now'), date('now', '+3 days'), 1, datetime('now')),
('sprint_cenbrap_02', 'proj_cenbrap_conc_001', 'Sprint 2: Redes Sociais', 'Mapeamento de presença digital', 'backlog', date('now', '+4 days'), date('now', '+4 days'), 2, datetime('now')),
('sprint_cenbrap_03', 'proj_cenbrap_conc_001', 'Sprint 3: Auditoria Conteúdo', 'Análise qualitativa do conteúdo', 'backlog', date('now', '+5 days'), date('now', '+7 days'), 3, datetime('now')),
('sprint_cenbrap_04', 'proj_cenbrap_conc_001', 'Sprint 4: Consolidação', 'Criação do dossiê final', 'backlog', date('now', '+8 days'), date('now', '+10 days'), 4, datetime('now'));

-- Create Tasks Sprint 1
INSERT INTO tasks (id, sprint_id, project_id, title, description, status, priority, assigned_to, created_at) VALUES
('task_cenbrap_01_001', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: Liberdade Médica', 'Extrair dados de https://liberdademedicaedu.com.br', 'todo', 'high', 'bolt-research', datetime('now')),
('task_cenbrap_01_002', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: Caduceu', 'Extrair dados de https://caduceucursos.com.br', 'todo', 'high', 'bolt-research', datetime('now')),
('task_cenbrap_01_003', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: Comportamente', 'Extrair dados de https://comportalmente.com.br', 'todo', 'high', 'bolt-research', datetime('now')),
('task_cenbrap_01_004', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: IPM (Pedro Miranda)', 'Extrair dados de https://ipmpos.com.br', 'todo', 'high', 'bolt-research', datetime('now')),
('task_cenbrap_01_005', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: Sanar', 'Extrair dados de https://sanar.com.br', 'todo', 'medium', 'bolt-research', datetime('now')),
('task_cenbrap_01_006', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: FGMed', 'Extrair dados de https://fgmed.org', 'todo', 'medium', 'bolt-research', datetime('now')),
('task_cenbrap_01_007', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: Unyleya', 'Extrair dados de https://unyleya.edu.br', 'todo', 'medium', 'bolt-research', datetime('now')),
('task_cenbrap_01_008', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: Unyleya Med', 'Extrair dados de https://unyleyamed.com.br', 'todo', 'medium', 'bolt-research', datetime('now')),
('task_cenbrap_01_009', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: Instituto CDT', 'Extrair dados de https://institutocdt.com.br', 'todo', 'medium', 'bolt-research', datetime('now')),
('task_cenbrap_01_010', 'sprint_cenbrap_01', 'proj_cenbrap_conc_001', 'Scraping: IBCMED', 'Extrair dados de https://ibcmed.com', 'todo', 'medium', 'bolt-research', datetime('now'));

-- Notes para dashboard
INSERT INTO notes (id, content, status, created_at) VALUES
('note_cenbrap_001', '🔥 PROJETO CENBRAP INICIADO\n\nCliente: Cenbrap\nProjeto: Análise de Concorrência\nPlayers: 20 sites\n\nSprint 1 ativa - Scraping em andamento\n\nPath: projects/cenbrap/concorrencia/', 'active', datetime('now'));
