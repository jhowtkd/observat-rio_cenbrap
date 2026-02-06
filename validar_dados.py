#!/usr/bin/env python3
"""
Script de Validação de Consistência - Inteligência Competitiva CENBRAP

Este script verifica automaticamente:
- Somas e contagens nos JSONs
- Consistência entre arquivos
- Duplicatas
- Campos obrigatórios

Uso: python3 validar_dados.py
"""

import json
import sys
from pathlib import Path
from collections import Counter


def print_header(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def print_result(test_name, passed, details=""):
    status = "✅ PASSOU" if passed else "❌ FALHOU"
    print(f"{status}: {test_name}")
    if details:
        print(f"       {details}")
    return passed


def validate_analise_precos():
    """Valida o arquivo analise_precos.json"""
    print_header("VALIDANDO: analise_precos.json")
    
    try:
        with open('analise_precos.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print_result("Carregar arquivo", False, str(e))
        return False
    
    all_passed = True
    
    # Test 1: Verificar se resumo existe
    if 'resumo' not in data:
        all_passed &= print_result("Estrutura: resumo existe", False, "Campo 'resumo' não encontrado")
    else:
        all_passed &= print_result("Estrutura: resumo existe", True)
    
    # Test 2: Contar preços transparentes manualmente
    com_transparencia = []
    for faixa, players in data.get('faixas_preco', {}).items():
        if faixa not in ['sem_preco_divulgado', 'mais_10k'] and isinstance(players, list):
            for p in players:
                if isinstance(p, dict) and p.get('transparencia') == True:
                    com_transparencia.append(p['nome'])
    
    resumo_transparente = data.get('resumo', {}).get('preco_transparente', 0)
    if len(com_transparencia) == resumo_transparente:
        all_passed &= print_result(
            f"Contagem preço transparente: {len(com_transparencia)} == {resumo_transparente}", 
            True
        )
    else:
        all_passed &= print_result(
            f"Contagem preço transparente", 
            False, 
            f"Encontrados: {len(com_transparencia)}, Resumo diz: {resumo_transparente}"
        )
    
    # Test 3: Verificar total
    sem_preco = data.get('faixas_preco', {}).get('sem_preco_divulgado', [])
    total_calc = len(com_transparencia) + len(sem_preco)
    total_resumo = data.get('resumo', {}).get('total_analisados', 0)
    
    if total_calc == total_resumo:
        all_passed &= print_result(f"Total analisado: {total_calc} == {total_resumo}", True)
    else:
        all_passed &= print_result(
            "Total analisado", 
            False, 
            f"Calculado: {total_calc}, Resumo diz: {total_resumo}"
        )
    
    # Test 4: Verificar campos de rastreabilidade
    players_sem_fonte = []
    for faixa, players in data.get('faixas_preco', {}).items():
        if isinstance(players, list):
            for p in players:
                if isinstance(p, dict) and 'fonte_preco' not in p:
                    players_sem_fonte.append(p.get('nome', 'desconhecido'))
    
    if not players_sem_fonte:
        all_passed &= print_result("Rastreabilidade: todos têm fonte_preco", True)
    else:
        all_passed &= print_result(
            "Rastreabilidade", 
            False, 
            f"{len(players_sem_fonte)} players sem campo 'fonte_preco'"
        )
    
    # Test 5: Verificar metadata
    if 'metadata' in data:
        all_passed &= print_result("Metadados presentes", True)
        required_meta = ['projeto', 'data_base', 'versao']
        missing = [m for m in required_meta if m not in data['metadata']]
        if not missing:
            all_passed &= print_result("Metadados obrigatórios", True)
        else:
            all_passed &= print_result("Metadados obrigatórios", False, f"Faltando: {missing}")
    else:
        all_passed &= print_result("Metadados presentes", False, "Campo 'metadata' não encontrado")
    
    return all_passed


def validate_mapa_vulnerabilidades():
    """Valida o arquivo mapa_vulnerabilidades.json"""
    print_header("VALIDANDO: mapa_vulnerabilidades.json")
    
    try:
        with open('mapa_vulnerabilidades.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print_result("Carregar arquivo", False, str(e))
        return False
    
    all_passed = True
    
    # Test 1: Verificar duplicatas em concorrentes_afetados
    for tipo, info in data.get('vulnerabilidades_por_tipo', {}).items():
        concorrentes = info.get('concorrentes_afetados', [])
        duplicatas = [item for item, count in Counter(concorrentes).items() if count > 1]
        
        if not duplicatas:
            all_passed &= print_result(f"Duplicatas em '{tipo}'", True)
        else:
            all_passed &= print_result(
                f"Duplicatas em '{tipo}'", 
                False, 
                f"Duplicatas encontradas: {duplicatas}"
            )
    
    # Test 2: Verificar metadata
    if 'metadata' in data:
        all_passed &= print_result("Metadados presentes", True)
    else:
        all_passed &= print_result("Metadados presentes", False)
    
    return all_passed


def validate_analise_propostas():
    """Valida o arquivo analise_propostas.json"""
    print_header("VALIDANDO: analise_propostas.json")
    
    try:
        with open('analise_propostas.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print_result("Carregar arquivo", False, str(e))
        return False
    
    all_passed = True
    
    # Test 1: Verificar consistência de contagem
    resumo = data.get('resumo', {})
    propostas = data.get('propostas_por_concorrente', [])
    
    total_lista = len(propostas)
    total_resumo = resumo.get('total_analisados', 0)
    
    if total_lista == total_resumo:
        all_passed &= print_result(f"Total consistente: {total_lista} == {total_resumo}", True)
    else:
        all_passed &= print_result(
            "Total consistente", 
            False, 
            f"Lista tem: {total_lista}, Resumo diz: {total_resumo}"
        )
    
    # Test 2: Verificar soma de propostas claras + confusas
    claras = resumo.get('proposta_clara', 0)
    confusas = resumo.get('proposta_confusa', 0)
    
    if claras + confusas == total_resumo:
        all_passed &= print_result(
            f"Soma propostas: {claras} + {confusas} = {total_resumo}", 
            True
        )
    else:
        all_passed &= print_result(
            "Soma propostas", 
            False, 
            f"{claras} + {confusas} = {claras + confusas}, mas total é {total_resumo}"
        )
    
    # Test 3: Verificar campos de rastreabilidade
    sem_fonte = [p['concorrente'] for p in propostas if 'fonte_dados' not in p]
    
    if not sem_fonte:
        all_passed &= print_result("Rastreabilidade: todos têm fonte_dados", True)
    else:
        all_passed &= print_result(
            "Rastreabilidade", 
            False, 
            f"{len(sem_fonte)} propostas sem 'fonte_dados'"
        )
    
    return all_passed


def validate_cross_consistency():
    """Valida consistência entre arquivos"""
    print_header("VALIDANDO: Consistência entre arquivos")
    
    all_passed = True
    
    try:
        with open('analise_precos.json', 'r', encoding='utf-8') as f:
            precos = json.load(f)
        with open('analise_propostas.json', 'r', encoding='utf-8') as f:
            propostas = json.load(f)
        with open('mapa_vulnerabilidades.json', 'r', encoding='utf-8') as f:
            vulns = json.load(f)
    except Exception as e:
        print_result("Carregar arquivos", False, str(e))
        return False
    
    # Test 1: Comparar totais entre precos e propostas
    total_precos = precos.get('resumo', {}).get('total_analisados', 0)
    total_propostas = propostas.get('resumo', {}).get('total_analisados', 0)
    
    # Verificar se há nota explicativa no metadata
    nota_propostas = propostas.get('metadata', {}).get('nota_escopo', '')
    tem_explicacao = 'não tiveram conteúdo suficiente' in nota_propostas or \
                     'dados suficientes' in nota_propostas
    
    # Propostas pode ter menos players (excluídos por conteúdo insuficiente)
    if total_propostas <= total_precos and tem_explicacao:
        all_passed &= print_result(
            f"Totais consistentes: precos={total_precos}, propostas={total_propostas} (com justificativa)", 
            True
        )
    elif abs(total_precos - total_propostas) <= 1:
        all_passed &= print_result(
            f"Totais alinhados: precos={total_precos}, propostas={total_propostas}", 
            True
        )
    else:
        all_passed &= print_result(
            "Totais alinhados", 
            False, 
            f"Diferença significativa: {total_precos} vs {total_propostas}. Adicione nota_escopo em metadata explicando."
        )
    
    return all_passed


def main():
    print("\n" + "=" * 70)
    print("  VALIDADOR DE DADOS - Inteligência Competitiva CENBRAP")
    print("=" * 70)
    print("\nEste script verifica a consistência e integridade dos dados.")
    print("Data de execução: 2026-02-06")
    
    results = []
    
    results.append(("analise_precos.json", validate_analise_precos()))
    results.append(("mapa_vulnerabilidades.json", validate_mapa_vulnerabilidades()))
    results.append(("analise_propostas.json", validate_analise_propostas()))
    results.append(("consistência cruzada", validate_cross_consistency()))
    
    print_header("RESUMO DOS TESTES")
    
    all_passed = True
    for name, passed in results:
        status = "✅ PASSOU" if passed else "❌ FALHOU"
        print(f"{status}: {name}")
        all_passed &= passed
    
    print("\n" + "=" * 70)
    if all_passed:
        print("  ✅ TODOS OS TESTES PASSARAM!")
        print("  Os dados estão consistentes e auditáveis.")
    else:
        print("  ❌ ALGUNS TESTES FALHARAM")
        print("  Verifique os detalhes acima e corrija os problemas.")
    print("=" * 70 + "\n")
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
