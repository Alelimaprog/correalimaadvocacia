<?php
/**
 * EXEMPLO de configuração SMTP — SEM CREDENCIAIS REAIS.
 * (Preparação para o formulário PHP/PHPMailer, que só será implementado na Fase 8.)
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ SEGURANÇA (obrigatório)                                                     │
 * │ O arquivo REAL de configuração NÃO pode ficar em public/, dist/ ou         │
 * │ public_html. Ele deve morar em diretório PRIVADO, acima do public_html.    │
 * │                                                                            │
 * │ Exemplo de caminho na HostGator:                                           │
 * │   /home/SEU_USUARIO/private/correalima/smtp.config.php                     │
 * │                                                                            │
 * │ O enviar.php (Fase 8) fará require desse caminho privado. Se o arquivo não  │
 * │ existir, o script deve falhar com erro seguro (sem vazar detalhes) e sem    │
 * │ expor credenciais.                                                          │
 * │                                                                            │
 * │ Este arquivo de exemplo pode ser versionado (não tem segredos).            │
 * │ O arquivo real está no .gitignore e NUNCA vai para o GitHub.               │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

return [
    'host'       => 'mail.correalimaadvocacia.com.br', // servidor SMTP (a confirmar)
    'port'       => 465,                                // 465 (SSL) ou 587 (TLS)
    'secure'     => 'ssl',                              // 'ssl' ou 'tls'
    'username'   => 'PREENCHER',                        // conta SMTP autenticada
    'password'   => 'PREENCHER',                        // senha — SOMENTE no arquivo privado real
    'from_email' => 'contato@correalimaadvocacia.com.br',
    'from_name'  => 'Site Corrêa Lima Advocacia',
    'to_email'   => 'contato@correalimaadvocacia.com.br', // destino (sem CC/BCC nesta versão)
];
