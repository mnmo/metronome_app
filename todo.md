
Working on:
-----------

+ [manifest] "fullscreen": "true" @done (2013-02-26 19:05)
+ travar a rotação @done (2013-02-26 19:06)
+ [manifest] default_locale @done (2013-02-26 19:06)

- limitar o slider quando o usuário interage via + e -
- pausar (ou parar) o som enquanto o usuário interage com o slider ou a tela de alteração da fração (performance)
- pendulo sai do limite na app instalada
- travar o scroll
- [manifest] when install screen shows up in the phone the Size is Unknown

-------------------------------------------------------------------------------

Manifest: https://developer.mozilla.org/en-US/docs/Apps/Manifest

Bugs a reportar (bugzilla)
==========================
- botoes de volume fisicos não influenciam o volume do speaker no mozAudioWrite


Before publishing
=================

- figure out a way to check versions / update

Deploy scripts
==============

- ver se vale a pena gerar varias versoes do soundsprite (mp3 ogg e wav)


UI
===

- icon 128px
- icon 64px
- icon 48px
- icon 32px
- icon 16px
- incorporar barra superior no layout, ou sumir com ela
- estado "pressed" dos botões
- representação alternativa para o pêndulo (animação mais simples, talvez madeira no lugar do vermelho)
- versão flipada da interface
- otimizar o peso das imagens


Sons
====

- refinar os tons (downbeat, upbeat e onbeat)

Site
====

- home page sobre a app com botão de install

Prog.
=====

- preload das imagens?
- checar bug de piscar azul mas não selecionar a fração em questão
- minificar JS
- talvez salvar ultimo estado no localstorage para o cara não ter que arrumar de novo


Localization
============



Future
=======
- migrar o site para um com ip fixo (linode talvez) e pegar um ssl certificate para habilitar o https
- inventar um activities e pensar em apps que poderiam conversar com o metronomo




