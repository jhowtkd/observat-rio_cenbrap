#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para mesclar dados do dashboard com dados estendidos da pasta Estudo.

Este script combina informações de três fontes:
1. Dashboard atual (concorrentes.json)
2. Dados estendidos (dados_estendidos_dashboard.json)
3. Mapeamento de redes sociais (mapeamento_redes_sociais.json)

Autor: Agência Claw
Data: 2026-02-06
Versão: 1.0
"""

import json
import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


# Caminhos dos arquivos
BASE_DIR = Path("/Users/jhonatan/Repos/Análise de concorrente Cenbrap")
DASHBOARD_FILE = BASE_DIR / "relatorio" / "dist" / "data" / "concorrentes.json"
DADOS_ESTENDIDOS_FILE = BASE_DIR / "dados_estendidos_dashboard.json"
MAPEAMENTO_REDES_FILE = BASE_DIR / "Estudo" / "reports" / "mapeamento_redes_sociais.json"
OUTPUT_FILE = BASE_DIR / "concorrentes_enriched.json"


def load_json_file(file_path: Path, file_description: str) -> Optional[dict]:
    """
    Carrega um arquivo JSON com tratamento de erros.
    
    Args:
        file_path: Caminho do arquivo
        file_description: Descrição do arquivo para logs
        
    Returns:
        Dicionário com os dados ou None em caso de erro
    """
    try:
        logger.info(f"Carregando {file_description}: {file_path}")
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logger.info(f"✓ {file_description} carregado com sucesso")
        return data
    except FileNotFoundError:
        logger.error(f"✗ Arquivo não encontrado: {file_path}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"✗ Erro ao decodificar JSON em {file_path}: {e}")
        return None
    except Exception as e:
        logger.error(f"✗ Erro inesperado ao carregar {file_path}: {e}")
        return None


def extract_redes_sociais_list(mapeamento_player: dict) -> list[str]:
    """
    Extrai lista de redes sociais do mapeamento de um player.
    
    Args:
        mapeamento_player: Dicionário com dados do mapeamento de redes
        
    Returns:
        Lista de nomes das redes sociais presentes
    """
    redes = []
    
    # Mapeamento de campos para nomes padronizados
    redes_map = {
        'instagram': 'Instagram',
        'youtube': 'YouTube',
        'linkedin': 'LinkedIn',
        'twitter': 'Twitter/X',
        'facebook': 'Facebook',
        'tiktok': 'TikTok',
        'spotify': 'Spotify',
        'podcast': 'Podcast',
        'whatsapp': 'WhatsApp'
    }
    
    for key, label in redes_map.items():
        value = mapeamento_player.get(key)
        if value and value not in ['Pendente', 'Não identificado', 'Não possui', None, '']:
            redes.append(label)
    
    return redes


def extract_presenca_digital(dados_complementares: dict, mapeamento_player: dict) -> dict:
    """
    Extrai dados de presença digital combinando múltiplas fontes.
    
    Args:
        dados_complementares: Dados do arquivo dados_estendidos_dashboard.json
        mapeamento_player: Dados do mapeamento de redes sociais
        
    Returns:
        Dicionário com presença digital estruturada
    """
    presenca = dados_complementares.get('presenca_digital', {})
    
    # Extrair seguidores do Instagram se disponível
    instagram_data = mapeamento_player.get('instagram', {})
    seguidores = None
    
    if isinstance(instagram_data, dict):
        seguidores = instagram_data.get('seguidores') or instagram_data.get('seguidores_fundador')
    elif isinstance(instagram_data, str) and 'K' in instagram_data:
        seguidores = instagram_data
    
    # Extrair nota
    nota = presenca.get('nota', '⭐⭐⭐')
    
    # Calcular score numérico baseado na nota
    score = nota.count('⭐') if nota else 3
    
    return {
        'seguidores_instagram': seguidores,
        'nota': nota,
        'score': score,
        'observacoes': presenca.get('instagram', '') if isinstance(presenca.get('instagram'), str) else None
    }


def get_dados_complementares(dados_estendidos: dict, player_id: str) -> Optional[dict]:
    """
    Recupera dados complementares de um player específico.
    
    Args:
        dados_estendidos: Dados estendidos completos
        player_id: ID do player
        
    Returns:
        Dicionário com dados complementares ou None
    """
    dados_comp = dados_estendidos.get('dados_complementares', {})
    return dados_comp.get(player_id)


def get_mapeamento_player(mapeamento_redes: dict, player_id: str) -> Optional[dict]:
    """
    Recupera dados de mapeamento de redes de um player específico.
    
    Args:
        mapeamento_redes: Dados de mapeamento de redes completos
        player_id: ID do player
        
    Returns:
        Dicionário com dados de mapeamento ou None
    """
    mapeamento = mapeamento_redes.get('mapeamento_rede_social', {})
    players = mapeamento.get('players', [])
    
    # Mapeamento de IDs para nomes
    id_to_name_map = {
        'liberdade_medica': 'Liberdade Médica',
        'caduceu': 'Caduceu Cursos',
        'comportamente': 'Comportalmente',
        'ipm': 'IPM Pós-Graduação (Pedro Miranda)',
        'sanar': 'Sanar',
        'fgmed': 'FGMED',
        'unyleya': 'Unyleya',
        'unyleya_med': 'UnyleyaMED',
        'cdt': 'Instituto CDT',
        'ibcmed': 'IBCMED / Inspirali Pós Medicina',
        'mevbrasil': 'MEV Brasil',
        'afya': 'Afya',
        'bws': 'Instituto BWS',
        'slmandic': 'São Leopoldo Mandic',
        'hcor': 'HCOR',
        'einstein': 'Einstein',
        'cetrus': 'Cetrus',
        'pucrs': 'PUCRS',
        'idomed': 'IDOMED',
        'sirio_libanes': 'Faculdade Sírio-Libanês'
    }
    
    player_name = id_to_name_map.get(player_id)
    
    if not player_name:
        return None
    
    for player in players:
        if player.get('nome') == player_name:
            return player
    
    return None


def merge_player_data(
    player_data: dict,
    dados_complementares: Optional[dict],
    mapeamento_player: Optional[dict]
) -> dict:
    """
    Mescla dados de um player com informações estendidas.
    
    Args:
        player_data: Dados originais do player do dashboard
        dados_complementares: Dados complementares do arquivo estendido
        mapeamento_player: Dados de mapeamento de redes sociais
        
    Returns:
        Dicionário com dados mesclados
    """
    # Criar cópia para não modificar o original
    merged = player_data.copy()
    
    # Inicializar seção enriched_data se não existir
    if 'enriched_data' not in merged:
        merged['enriched_data'] = {}
    
    # Adicionar modelo de negócio
    if dados_complementares:
        modelo_negocio = dados_complementares.get('modelo_negocio')
        if modelo_negocio:
            merged['enriched_data']['modelo_negocio'] = modelo_negocio
            logger.debug(f"  → Adicionado modelo_negocio: {modelo_negocio}")
    
    # Adicionar estratégia de conteúdo
    if dados_complementares:
        estrategia = dados_complementares.get('estrategia_conteudo')
        if estrategia and estrategia != 'Não mapeado':
            merged['enriched_data']['estrategia_conteudo'] = estrategia
            logger.debug(f"  → Adicionado estrategia_conteudo: {estrategia}")
    
    # Adicionar presença digital
    if dados_complementares or mapeamento_player:
        presenca = extract_presenca_digital(dados_complementares or {}, mapeamento_player or {})
        merged['enriched_data']['presenca_digital'] = presenca
        logger.debug(f"  → Adicionado presenca_digital: score {presenca['score']}/5")
    
    # Adicionar redes sociais
    if mapeamento_player:
        redes = extract_redes_sociais_list(mapeamento_player)
        if redes:
            merged['enriched_data']['redes_sociais'] = redes
            logger.debug(f"  → Adicionado redes_sociais: {', '.join(redes)}")
    elif dados_complementares:
        redes = dados_complementares.get('redes_sociais', [])
        if redes:
            merged['enriched_data']['redes_sociais'] = redes
            logger.debug(f"  → Adicionado redes_sociais (de dados_complementares): {', '.join(redes)}")
    
    # Adicionar diferenciais detalhados
    diferenciais_detalhados = []
    
    # Tentar obter de dados_complementares
    if dados_complementares:
        difs = dados_complementares.get('diferenciais', [])
        if difs:
            diferenciais_detalhados = difs
    
    # Se não houver diferenciais detalhados, usar os diferenciais do posicionamento
    if not diferenciais_detalhados and 'posicionamento' in merged:
        difs_pos = merged['posicionamento'].get('diferenciais', [])
        if difs_pos:
            diferenciais_detalhados = difs_pos
    
    if diferenciais_detalhados:
        merged['enriched_data']['diferenciais_detalhados'] = diferenciais_detalhados
        logger.debug(f"  → Adicionado diferenciais_detalhados: {len(diferenciais_detalhados)} itens")
    
    # Adicionar dados numéricos se disponíveis
    if dados_complementares:
        numeros = dados_complementares.get('numeros', {})
        if numeros:
            merged['enriched_data']['numeros'] = numeros
            logger.debug(f"  → Adicionado numeros: {list(numeros.keys())}")
        
        # Adicionar quantidade de produtos
        qtd_produtos = dados_complementares.get('quantidade_produtos')
        if qtd_produtos:
            merged['enriched_data']['quantidade_produtos'] = qtd_produtos
            logger.debug(f"  → Adicionado quantidade_produtos: {qtd_produtos}")
        
        # Adicionar dados de comunidade
        comunidade = dados_complementares.get('comunidade')
        if comunidade:
            merged['enriched_data']['comunidade'] = comunidade
            logger.debug(f"  → Adicionado comunidade: {comunidade}")
    
    return merged


def validate_enriched_data(data: dict) -> dict:
    """
    Valida os dados enriquecidos e retorna estatísticas.
    
    Args:
        data: Dados enriquecidos completos
        
    Returns:
        Dicionário com estatísticas de validação
    """
    stats = {
        'total_concorrentes': 0,
        'com_modelo_negocio': 0,
        'com_estrategia_conteudo': 0,
        'com_presenca_digital': 0,
        'com_redes_sociais': 0,
        'com_diferenciais_detalhados': 0,
        'sem_dados_enriquecidos': 0
    }
    
    concorrentes = data.get('concorrentes', {})
    stats['total_concorrentes'] = len(concorrentes)
    
    for player_id, player_data in concorrentes.items():
        enriched = player_data.get('enriched_data', {})
        
        if not enriched:
            stats['sem_dados_enriquecidos'] += 1
            continue
        
        if enriched.get('modelo_negocio'):
            stats['com_modelo_negocio'] += 1
        
        if enriched.get('estrategia_conteudo'):
            stats['com_estrategia_conteudo'] += 1
        
        if enriched.get('presenca_digital'):
            stats['com_presenca_digital'] += 1
        
        if enriched.get('redes_sociais'):
            stats['com_redes_sociais'] += 1
        
        if enriched.get('diferenciais_detalhados'):
            stats['com_diferenciais_detalhados'] += 1
    
    return stats


def save_json_file(data: dict, file_path: Path) -> bool:
    """
    Salva dados em arquivo JSON com tratamento de erros.
    
    Args:
        data: Dados a serem salvos
        file_path: Caminho do arquivo de saída
        
    Returns:
        True se salvou com sucesso, False caso contrário
    """
    try:
        logger.info(f"Salvando arquivo enriquecido: {file_path}")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logger.info(f"✓ Arquivo salvo com sucesso: {file_path}")
        return True
    except Exception as e:
        logger.error(f"✗ Erro ao salvar arquivo: {e}")
        return False


def main():
    """
    Função principal que orquestra a mesclagem dos dados.
    """
    logger.info("=" * 60)
    logger.info("INICIANDO MESCLAGEM DE DADOS DO DASHBOARD")
    logger.info("=" * 60)
    
    # Carregar arquivos
    dashboard_data = load_json_file(DASHBOARD_FILE, "Dashboard atual")
    dados_estendidos = load_json_file(DADOS_ESTENDIDOS_FILE, "Dados estendidos")
    mapeamento_redes = load_json_file(MAPEAMENTO_REDES_FILE, "Mapeamento de redes sociais")
    
    # Verificar se todos os arquivos foram carregados
    if not dashboard_data:
        logger.error("✗ Falha crítica: Dashboard não pôde ser carregado")
        return 1
    
    if not dados_estendidos:
        logger.warning("⚠ Dados estendidos não disponíveis - continuando apenas com dashboard")
    
    if not mapeamento_redes:
        logger.warning("⚠ Mapeamento de redes não disponíveis - continuando sem dados de redes")
    
    # Criar cópia dos dados do dashboard para enriquecer
    enriched_data = {
        'metadata': dashboard_data.get('metadata', {}).copy(),
        'grupos': dashboard_data.get('grupos', {}),
        'concorrentes': {},
        'analise_geral': dashboard_data.get('analise_geral', {})
    }
    
    # Atualizar metadata
    enriched_data['metadata']['versao'] = '3.0-enriched'
    enriched_data['metadata']['data_enriquecimento'] = datetime.now().strftime('%Y-%m-%d')
    enriched_data['metadata']['fontes_adicionais'] = [
        'dados_estendidos_dashboard.json',
        'mapeamento_redes_sociais.json'
    ]
    
    # Processar cada concorrente
    concorrentes = dashboard_data.get('concorrentes', {})
    total = len(concorrentes)
    
    logger.info(f"\nProcessando {total} concorrentes...")
    logger.info("-" * 60)
    
    for idx, (player_id, player_data) in enumerate(concorrentes.items(), 1):
        logger.info(f"[{idx}/{total}] Processando: {player_id}")
        
        # Obter dados complementares
        dados_comp = None
        if dados_estendidos:
            dados_comp = get_dados_complementares(dados_estendidos, player_id)
        
        # Obter dados de mapeamento
        mapeamento = None
        if mapeamento_redes:
            mapeamento = get_mapeamento_player(mapeamento_redes, player_id)
        
        # Mesclar dados
        merged_player = merge_player_data(player_data, dados_comp, mapeamento)
        enriched_data['concorrentes'][player_id] = merged_player
        
        # Log de status
        if dados_comp or mapeamento:
            logger.info(f"  ✓ Dados enriquecidos adicionados")
        else:
            logger.info(f"  ⚠ Sem dados adicionais disponíveis")
    
    # Validar dados enriquecidos
    logger.info("\n" + "=" * 60)
    logger.info("VALIDAÇÃO DOS DADOS ENRIQUECIDOS")
    logger.info("=" * 60)
    
    stats = validate_enriched_data(enriched_data)
    
    logger.info(f"Total de concorrentes: {stats['total_concorrentes']}")
    logger.info(f"Com modelo_negocio: {stats['com_modelo_negocio']}")
    logger.info(f"Com estrategia_conteudo: {stats['com_estrategia_conteudo']}")
    logger.info(f"Com presenca_digital: {stats['com_presenca_digital']}")
    logger.info(f"Com redes_sociais: {stats['com_redes_sociais']}")
    logger.info(f"Com diferenciais_detalhados: {stats['com_diferenciais_detalhados']}")
    logger.info(f"Sem dados enriquecidos: {stats['sem_dados_enriquecidos']}")
    
    # Salvar arquivo de saída
    logger.info("\n" + "=" * 60)
    logger.info("SALVANDO ARQUIVO FINAL")
    logger.info("=" * 60)
    
    if save_json_file(enriched_data, OUTPUT_FILE):
        # Calcular tamanho do arquivo
        file_size = OUTPUT_FILE.stat().st_size
        logger.info(f"Tamanho do arquivo: {file_size / 1024:.2f} KB")
        logger.info("\n✓ Processo concluído com sucesso!")
        return 0
    else:
        logger.error("\n✗ Falha ao salvar arquivo")
        return 1


if __name__ == "__main__":
    sys.exit(main())
