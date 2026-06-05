# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Repositório GitHub: https://github.com/gn7agency/projeto-claude-code (privado)

Git configurado com:
- User: Gabriel (gabriel@gn7agency.com)
- Default branch: `main`

## Sincronização Automática com GitHub

A cada arquivo criado ou editado pelo Claude Code, um hook PostToolUse executa automaticamente:
1. `git add -A` — staged todas as alterações
2. `git commit -m "Auto-update: <timestamp>"`
3. `git push` — envia para o GitHub

O hook está em `.claude/settings.json` (matcher: `Write|Edit|NotebookEdit`).

## Setup

When the project stack is defined, update this file with:
- Build commands
- How to run the dev server
- How to run tests (including a single test)
- Lint/format commands
- Environment variables required
