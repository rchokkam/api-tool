# Getting started as Kasia2 developer #
[TOC]
En hurtig mÃ¥de at komme i gang med 
(Installer linux :))

## Start op med GIT første gang ##

   * Opret en github konto
   * Få din konto inkluderet i yousee github gruppen (send en mail med dit github-brugernavn til David Nielsen)
   * Installer GIT
   * LÃ¦s ogfÃlg
https://yousee.jira.com/wiki/pages/viewpage.action?pageId=12780773
   * OpsÃt en clojars.org konto - se vejledning i developer guidelines

## installer leiningen og Clojoure ##

For at installere Leiningen skal man kun hente og køre et script, det skal lægges et sted som er i ens PATH:

	cd ~/bin
	wget http://github.com/technomancy/leiningen/raw/stable/bin/lein
	chmod +x lein

Så kan man lave en self-install:

	lein self-install

Dette vil hente et antal jar-filer, inklusive Clojure. Så når det her er ordnet så er Clojure og Leiningen installeret.

## Lav din personlige klon af de forskellige under projekter ##
Klik på fork-knappen i det projekt du skal arbejde med og lav derefter en klon på din lokale maskine:

Kør 
	git clone git@github.com:ditnavn/docs.git
for at klone dokumentations sitet.

## Få din email på Kasia2 mailinglisten ##

Send en email til Lars Vange med ønske om at blive føjet til mail listen. Snak evt med Lars direkte.
Snak med Jonas om at gÃ¥ adgang til sltarray02:8080 proxy. (den tillader ssh adgang til verde



