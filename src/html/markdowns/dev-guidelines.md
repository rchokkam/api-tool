# Guidelines for interne udviklere

## Versionering

Der arbejdes med to former for versionering, nemlig

1. Versionering af API'et via Mediatype, som beskrevet i guidelines.md
2. Versionering af den deployable fil, via standard versionering, f.eks. 2.1.3 som hhv. er major, minor og patch version

ad 1) Ved versionering i Mediatypen skal der være en dispatcher der kan reagere på denne. Det kan man i Apache via mod?rewrite, der kan checke på HTTP_ACCEPT. Hvis 2 versioner af API'et er deployet på same maskine, skal der skelnes på context path, hvilket sker automatisk hvis vores war filer har versionsnummer som en del af filnavnet, og de bare kopieres til webapps. Alternativt kan context path sættes op i Tomcat konfigurationen. På denne måde kan tidligere versioner køre videre uden ændringer. For at dette er praktisk skal det vedtages at der ikke laves kode ændringer på gamle versioner af API'et, men at hvis der er fejl som klienten finder væsentlige, må denne opgradere til den aktuelle API version.

ad 2) Fejlrettelser i forbindelse med nød releases, rettes via en patch release af det pågældende modul, ligesom nye features kommer i en opdatering af minor versionsnummeret. Major bruges kun i forbindelse med radikale ændringer.

## Release 
Ved Releases skal der lavet et tag i git.  
Der kan ikke releases hvis der bliver brugt SNAPSHOT versioner.
  

Tagging new Release
	
    change versionnumber in project.clj to 1.0.1
    git commit -am "version 1.0.1"
    git push 	
    git tag "1.0.1"
    git push --tags
    lein uberwar / lein jar 


## Tomcat opsætning

For at undgå OutOfmemory fejl ved deployment tilføjes i f.eks. catalina.sh

    JAVA_OPTS="$JAVA_OPTS -XX:+CMSClassUnloadingEnabled -XX:+CMSPermGenSweepingEnabled -XX:+UseConcMarkSweepGC -Xmx256m -Xms256m -XX:PermSize=512m -XX:MaxPermSize=512m"

Følgende parametre giver en masse log info om garbage collection

    -verbose:gc -XX:+PrintClassHistogram"
    
Oracle driveren skal ligge i Tomcat, og ikke i WEB-INF/lib, så ojdb14 skal kun optræde i dev-dependencies.

##  JNDI/JDBC opsætning

Der anvendes JNDI/JDBC standart til at tilgå databaser og andre properties.

Databaserne kan rammes fra clojure via properties setup således (datasource navn + prefix 'java:comp/env/'):

    :edm-ds {:name "java:comp/env/jdbc/EDM"}


Der er defineret 2 datasources:


    navn, bruger, maskine,db-sid

    jdbc/Casper,kasia,delhi,tctv3
    jdbc/EDM,k2_dw,lisbon,tctvspoc

Der ligger en global property med et link til den Kasia(Classic) vi kører op imod på det pågældende miljø.

hvert modul har reserveret et namespace i jndi.
det ligger under: 'java:comp/env/kasia2/{miljø}'
heri kan der defineres modul specifikke properties.

### JNDI på en embedded Jetty

for at vi kan tilgå JNDI når vi kører i dev med en embedded Jetty server skal vi have bootet den op med de JNDI properties modulerne benytetr

dette kræver at der udover ring-jetty-adapter bliver depended på 2 jetty jars:
org.mortbay.jetty/jetty-plus
org.mortbay.jetty/jetty-naming

    [org.mortbay.jetty/jetty-plus "6.1.14"]
    [org.mortbay.jetty/jetty-naming "6.1.14"]

der skal så lægges en jetty.xml og en jndi.properties under test

jndi.properties skal indholde:

    java.naming.factory.url.pkgs=org.mortbay.naming
    java.naming.factory.initial=org.mortbay.naming.InitialContextFactory


et eksempel på jetty.xml


	<Configure id="Server" class="org.mortbay.jetty.Server">
	  <New class="org.mortbay.jetty.plus.naming.Resource">
	    <Arg></Arg>
	    <Arg>java:comp/env/jdbc/EDM</Arg>
	    <Arg>
	      <New class="oracle.jdbc.pool.OracleDataSource">
		<Set name="DriverType">thin</Set>
		<Set name="URL">jdbc:oracle:thin:@lisbon:1521:tctvspoc</Set>
		<Set name="User">k2_dw</Set>
		<Set name="Password">XXXX</Set>
	      </New>
	    </Arg>
	  </New>
	  
	  <New class="org.mortbay.jetty.plus.naming.Resource">
	    <Arg></Arg>
	    <Arg>java:comp/env/kasia2/kasiahost</Arg>
	    <Arg>
	      <New class="java.lang.String">
		<Arg>http://darton:40201</Arg>
	      </New>
	    </Arg>
	  </New>

	  <New class="org.mortbay.jetty.plus.naming.Resource">
	    <Arg></Arg>
	    <Arg>java:comp/env/kasia2/adresse/base-uri</Arg>
	    <Arg>
	      <New class="java.lang.String">
		<Arg>http://localhost:8080/adresse-v1</Arg>
	      </New>
	    </Arg>
	  </New>
	</Configure>


for at få jetty bootet op med denne opsætning skal vi lige have injectet configurationen

eksempel på jetty.clj


	(ns jetty
	  (:use adresse.routes
	ring.adapter.jetty)
	  (:require [clojure.contrib.duck-streams :as ds])
	  (:import (org.mortbay.xml XmlConfiguration)
	(org.mortbay.jetty.webapp WebAppContext)))

	(defn init-server [server]
	  (try
	    (let [config (XmlConfiguration. (slurp "test/jetty.xml"))]
	      (. config configure server))
	    (catch Exception e
	      (prn "Unable to load jetty configuration")
	      (. e printStackTrace))))


	(defn boot []
	  (future (run-jetty #'app {:port 8080 :configurator init-server})))





## Ring opsætning
Kunde erstattes med nyt namespace. http body indeholder json objekter. 

### routes.clj  
    (ns kunde.routes                                                                                      
      (:use compojure.core
       ring.middleware.reload
       ring.middleware.json-params
       ring.util.response
       ring.util.servlet
       clojure.contrib.json
       ring.commonrest
       [kunde.services :as ser]
     (:require [compojure.route :as route]
       [clojure.contrib.logging :as logging])))

    (defroutes handler
    
     ; header_host is from the http headers and promoted to a param via wrap_promote_header	
     (GET "/kunde/:id/sso/" [id header_host] 	
        (ser/some-service id header_host))

     (route/not-found (route-not-found-text)))
    )

    (def app
      (-> (var handler)
     ; order is important first wrap-request-log-and-error-handling - then wrap-json-params; then wrap-promote-header
     (wrap-request-log-and-error-handling)
     (wrap-json-params) 
     (wrap-promote-header)))


For at kunne have flere versioenr af samme modul kørende på tomcat er det nødvendigt at ignorere første element i contextpath
ring/compojure har den mulighed at der kan matches på en regex i ruten.
se: 
    
    https://github.com/weavejester/compojure/wiki/Routes-In-Detail

her er et eksempel der matcher "*/docs":

    (GET ["/:context/docs", :context #".[^/]*"] req


### kunde.service.clj

    (ns kunde.service (:use ring.commonrest))

    (defn some-service "api dokumentation for some-service" [id host]
     {:pre [(chk 400 (not (empty? host)))] ; 400 is the httpcode for the http response if pre condition fails.
      :post [(chk 404 (is-empty? (:body %)))]} ; 404 is the httpcode for the http response if the post condition fails.
	(json-response {:host host, :id id}))    


### test/jetty.clj

Til at starte jetty

    (ns jetty
      (:use kunde.routes
         ring.adapter.jetty ))
    (defn boot []
      (future (run-jetty #'app {:port 8080})))


## Lazytest

### Structure 
    test/component/    ; Test that require database and other external resources.
    test/unit/         ; Test that can be run without any resources

### Lein lazytest
    :dev-dependencies [. .. [lein-lazytest "1.0.1"]]
    :lazytest-path ["src" "test/unit"]

### Kode eksempel.

...  

## Autodoc

Namespace skal dokumenteres med dokumentation og author tag.
Alle public funktioner og fields skal dokumenteres.

### Eksempel 

Namespace 
	(ns ^{:doc "namespace dokumentation " :author "Thomas Engelschmidt"} ...)
Funktion
	(defn some-func "funktion dokumentation" [] .... )
Field
	(def ^{:doc "Field dokumentation"} some-field "value" )

### Lein autodoc 

    :dev-dependencies [. ..  [autodoc "0.7.1" :exclusions [org.clojure/clojure-contrib] ]
    :autodoc {
         :name "Kasia 2.0"
         :description "YouSee's Kunde system"
         :copyright "Copyright 2010 YouSee a/s"
         :output-path "public/autodoc"}


## Alivetester

Der er defineret regler for alive tester, det er op til det enkelte
modul at definere /alive routen. Den skal returnere et json dokument
med records for hver enkelt kritiske resource (typisk
datasources). Hver enkel record skal indeholde mindst to felter, state
og name.  Man kan definere alle de ekstra felter man vil. State skal
være "OK" med store bogstaver. Name skal indeholde et sigende navn. I
common er der defineret en funktion som pinger de datasources man
specificerer i funktionskaldet. Man kalder dbalive med datasources. 

### Eksempel  


Svar fra funktionen

    [{:name "Some Alivetester", :state "OK"}
     ...
     ]

Funktionskald  

    (dbalive :ca-db :edw-db)


## Docs

De forskellige interfaces er beskrevet med en URI og en beskrivelse af input og output data. For at en klient skal kunne forstå de data elementer der kommer tilbage fra interfacet skal datastrukturen beskrives så klienterne kan kodes rigtigt.

### Specifikation af resource beskrivelser
Et eksempel på en request er 

	GET http://darton:41000/adresse-v1.0/postdistrikt/2200  
	
som søger efter navnet på postdistriktet der svarer til postnummeret 2200. Svaret der kommer tilbage ser således ud:

	{"postdistrikt":"København N"}  
	
Der er nogle fælles træk der benyttes for at beskrive et dokument, det ligger tæt op ad JSON specifikationen. I dokumentationen benyttes følgende guidelines til beskrivelse af requests og response. Der skelnes mellem beskrivelse af en resource, altså en slags spec for dataformatet og et eksempel på data.
Hvis man kan dokumentere en resource fyldestgørende med et eksempel er det lovlig dokumentation, hvis der er ikke-obligatoriske felter, eller felter der kan være null, skal resourcen beskrives med en resource specifikation.
Guidelines for data eksempler:  

* requests hvor klienten selv skal sætte data ind markeres feltet med "større-end"/"mindre-end" parenteser og feltets navn imellem parenteserne. 
* data er beskrevet i "dokumenter" inden for tuborg klammer.
* data er beskrevet som `"key":value,`
* lister er beskrevet i firkantede parenteser adskilt af komma. Et element beskrives i tuborg parenteser f.eks. 
	`"interval":[{"min":3},{"max":6}]`
* data elementer afsluttes med komma ","
* data navn, eller key, er i gåseøjne f.eks: 
	`"postdistrikt"`
* i eksempler på returnerede data elementer er data omkranset af gåseøjne hvis data er andet end tal. Eksempel:

    	{
    	"postnummer":2200
    	"postdistrikt":"København N"
    	}

Guidelines for resource specifikationer	  

* i beskrivelse af en resource er data typer er i "større end" / "mindre end" parenteser. F.eks. 
	`"husnr":<integer>`
* i beskrivelse af en resource er ikke-obligatoriske felter omkranset af firkantede parenteser f.eks. 
	`["stednavn":<string>]`
* i en resource beskrivelse er et felt beskrevet med 
	`datanavn:<datatype> /* beskrivelse */`
* ved felter der kan være null er datatypen markeret med stjerne. f.eks. 
	`mobil-nr: *<integer>`
* ved felter hvor der er et begrænset antal lovlige værdier er de lovlige værdier skrevet i bløde parenteser, adskilt af en pipe "|" efter datatypen. eksempel: 
	`["side":<string> ("Th"|"Tv"|"Midtfor")]`
* lister er beskrevet i firkantede parenteser i værdi-delen. En ikke obligatorisk liste er beskrevet således: 
	`["postnummer":[<integer>,<integer>]] /* elementerne er min og max */`

Således er en adresse resource beskrevet på følgende måde:  

	amsid : <int>
    [caid : <string>]
    [stednavn : <string>]
    vejnavn : <string>
    husnr : <int>
    [bogstav : <string>]
    [etage : <string>]
    [side : <string>]
    [doernr : <int>]
    [postbox : <string>]
    postnr : <int>
    by : <string>
    [region : <string>]
    [land : <string>]

#### Referencer
[JSON schema](http://tools.ietf.org/html/draft-zyp-json-schema-03)  
[Facebook dokumentation](http://developers.facebook.com/docs/reference/api/status/)  
[HTTP 1.1 status kode definitioner](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10)  




### Opbygning af MD filer

Når du bygger din struktur opi dine MD (markdown) filer skal du huske at bruge headers rigtigt således at 'Table of Contents' bliver bygget rigtigt op.

	# = <H1>
	## = <H2>
	### = <H3>
	#### = <H4>

Med ovenstående struktur bygges TOC'en op i et hierakisk træstruktur hvor \# er parent osv.

## Clojars,org 
Vi bruger clojars.org til at host public jars. 
hvordan det gøres er beskrivet i [clojars.org-information.md](https://github.com/yousee/docs/blob/master/clojars.org-information.md)

## Review

## Release procedure

## Test procedure

## Git flow

### Git setup
Se yousee wiki side om [git & github](https://yousee.jira.com/wiki/pages/viewpage.action?pageId=12780773)

## FAQ 

### JDBC Debugging 

Dependencies  

    [org.clojars.slyphon/log4jdbc4 "1.2Beta2"]
    [org.slf4j/slf4j-api "1.6.1"]
    [org.slf4j/slf4j-log4j12 "1.6.1"]

JDBC driver                 

    :classname "net.sf.log4jdbc.DriverSpy"
    :subprotocol "log4jdbc:oracle:thin"


### Maven Snapshot Problem 
Hvis det ikke er muligt at hente eksterne snapshots fra ex. clojars.org. 
Kan det skyldes at ens settings.xml i ~/.m2/[settings](https://yousee.jira.com/wiki/download/attachments/7209526/settings.xml)
ikke er konfigureret til at bruge public snapshots.
Settings skal indeholde nedestående 
    <activeProfiles>
		<activeProfile>development</activeProfile> 
		<activeProfile>public-snapshots</activeProfile>
    </activeProfiles>


## Deploying to nexus (our private maven repository)

you need maven installed,

the url and the repositoryId for the destination repository.


### We currently only have 3 repos

id: "_releases_"
url: "_http://swansea:8081/nexus/content/repositories/releases_"

id: "_snapshots_"
url: "_http://swansea:8081/nexus/content/repositories/snapshots_"

id: "_thirdparty_"
url: "_http://swansea:8081/nexus/content/repositories/thirdparty_"


### Commands:

    lein deps
    lein jar
    lein pom
    mvn deploy:deploy-file -DpomFile=pom.xml \
                           -Dfile={myfile.jar} \
                           -DrepositoryId={releases|snapshots} \
                           -Durl=http://swansea:8081/nexus/content/repositories/{releases|snapshots}

## Url Rewrite Filter

Vi bruger et Tomcat filter der hedder "url Rewrite Filter".
Dens hjemmeside er her: [Url Rewrite Filter](http://www.tuckey.org/urlrewrite/)

Når man har sat alting op og startet sin server, kan man se status, samt hvordan reglerne parses ved at gå til **[context]/rewrite-status**


###Tilføj jar
Tilføj urlrewrite som dependency, så den kommer på path'en i Tomcat. Den er allerede lagt i Nexus

Indsæt **[org.tuckey/urlrewrite "3.2.0"]** som dependency til din project.clj

Kør: **lein deps**


###Redigér web.xml
Tilføj følgende til **web.xml**: 

	<?xml version="1.0" encoding="UTF-8"?>
	<web-app ...
		...
		
		<filter>
			<filter-name>UrlRewriteFilter</filter-name>
			<filter-class>org.tuckey.web.filters.urlrewrite.UrlRewriteFilter</filter-class>
			<init-param>
				<param-name>confReloadCheckInterval</param-name>
				<!-- reload every x seconds, 0 for disable reload -->
				<param-value>0</param-value>
			</init-param>

			<init-param>
				<param-name>confPath</param-name>
				<param-value>/WEB-INF/classes/urlrewrite.xml</param-value>
			</init-param>
		</filter>
		<filter-mapping>
			<filter-name>UrlRewriteFilter</filter-name>
			<url-pattern>/*</url-pattern>
			<dispatcher>REQUEST</dispatcher>
			<dispatcher>FORWARD</dispatcher>
		</filter-mapping>
		
		...
	</web-app>


###Tilføj urlrewrite.xml
Tilføj en **urlrewrite.xml** fil til dit **src** bibliotekt, så den ligger sammen med **web.xml**

**OBS** det er vigtigt at `<?xml ...` er i starten af første linje. Ellers kaster XML parseren op.

####Afsaetning
Den ser således ud for **afsaetning**: 
	
	<?xml version="1.0" encoding="utf-8"?>
	<!DOCTYPE urlrewrite PUBLIC "-//tuckey.org//DTD UrlRewrite 3.0//EN" "http://tuckey.org/res/dtds/urlrewrite3.0.dtd">
	<urlrewrite>
		<rule>
			<condition name="accept" operator="notequal">application/vnd.yousee.kasia2.afsaetning\+json</condition>
			<from>^((?!^/alive).)*$</from>
			<set type="status">406</set>
			<to last="true">null</to>
		</rule>
	</urlrewrite>

Den første rule er lidt complex at læse. Den siger at alle urler som ikke lever op til /alive skal afvises, hvis de ikke har "application/vnd.yousee.kasia2.afsaetning+json" som accept-header. Selve regexen er ret kryptisk, da den laver noget snedigt med invers af grupper. Den er dog til at copy 'n paste i, uden den store risiko for fejl.
	
####Kunde
Den ser således ud for **kunde**, da der var særlige behov: 
	
	<?xml version="1.0" encoding="utf-8"?>
	<!DOCTYPE urlrewrite PUBLIC "-//tuckey.org//DTD UrlRewrite 3.0//EN" "http://tuckey.org/res/dtds/urlrewrite3.0.dtd">
	<urlrewrite>
		<rule>
			<condition name="accept" operator="notequal">application/atom\+xml</condition>
			<from>^/sso/notifications</from>
			<set type="status">406</set>
			<to last="true">null</to>
		</rule>
		
		<rule>
			<condition name="accept" operator="notequal">application/vnd.yousee.kasia2.kunde\+json</condition>
			<from>^((?!^/sso/notifications|^/alive|^/config|^/sso/synkroniser).)*$</from>
			<set type="status">406</set>
			<to last="true">null</to>
		</rule>
	</urlrewrite>

Den første "rule" siger at alle dem der rammer <context>/sso/notifications, skal have accept-headeren "application/atom+xml"

Den anden "rule" er noget mere complex at læse. Den siger at alle urler som ikke lever op til /sso/notifications eller /alive eller /config eller /sso/synkroniser skal afvises hvis de ikke har "application/vnd.yousee.kasia2.kunde\+json" som accept-header.
	
##Apache proxy opsætning
I backend har vi brug for at vide hvad klientens originale url er for at kunne opbygge gode REST svar med absolutte url'er.
Derudover har vi brug for at kunne lave versionsstyring, og lade accept-headeren afgøre hvor man sender requesten hen.

###Apache config
Derfor har vi lavet følgende opsætning til Apache:

	### LOAD PROXY AND REWRITE MODULES
	#Only load them if they are not already loaded
	<IfModule !proxy_module>
		LoadModule proxy_module modules/mod_proxy.so
	</IfModule>
	
	<IfModule !proxy_ajp_module>
		LoadModule proxy_ajp_module modules/mod_proxy_ajp.so
	</IfModule>
	
	<IfModule !proxy_http_module>
		LoadModule proxy_http_module modules/mod_proxy_http.so
	</IfModule>
	
	<IfModule !rewrite_module>
		LoadModule rewrite_module modules/mod_rewrite.so
	</IfModule>
	
	<IfModule !headers_module>
		LoadModule headers_module modules/mod_headers.so
	</IfModule>
	
	
	
	<IfModule rewrite_module>
	<IfModule headers_module>
	<IfModule proxy_module>
	<IfModule proxy_http_module>
	
	####### INITIAL SETUP #########################
		RewriteEngine on
	
	####### SET HEADERS #########################
		#get and set the host name
			RewriteRule .* - [E=INFO_HTTP_HOST:%{HTTP_HOST},NE]
			RequestHeader set x-orig-host "%{INFO_HTTP_HOST}e"
	
			
		#get and set the host port
			RewriteRule .* - [E=INFO_SERVER_PORT:%{SERVER_PORT},NE]
			RequestHeader set x-orig-port "%{INFO_SERVER_PORT}e"
	
			
		#If the uri starts with a slash and some alphanumerics, then make a 
		#group of that until the first non-alpha (ie. the next slash)
			RewriteCond %{REQUEST_URI} ^(/[\w-]+)
		#Save the content of the regex match group ( %1 ) in an environment variable
			RewriteRule .* - [E=INFO_REQUEST_CONTEXT:%1,NE]
		#Set a header with the content of the environment variable
			RequestHeader set x-orig-context "%{INFO_REQUEST_CONTEXT}e"
	
			
		#If the accept-header contains a number after ;version= then make a regex group of that number
			RewriteCond %{HTTP_ACCEPT} \+json;version=(\d+)$ 
		#Save the content of the regex match group ( %1 ) in an environment variable
			RewriteRule .* - [E=INFO_ACCEPT_VERSION:%1,NE]
		#Set a header with the content of the environment variable
			RequestHeader set x-orig-accept-version "%{INFO_ACCEPT_VERSION}e"
	
			
		#If the accept-header contains kasia2. followed by some letters, 
		#then make a regex group of those letters
			RewriteCond %{HTTP_ACCEPT} kasia2.(\w+).*
		#Save the content of the regex match group ( %1 ) in an environment variable
			RewriteRule .* - [E=INFO_ACCEPT_NAME:%1,NE]
		#Set a header with the content of the environment variable
			RequestHeader set x-orig-accept-name "%{INFO_ACCEPT_NAME}e"
	
			
		#If https is on ...
			RewriteCond %{HTTPS} on
		#...then set the protocol environment variable to "https"
			RewriteRule .* - [E=INFO_PROTOCOL:https,NE]
		#If https is off ...
			RewriteCond %{HTTPS} off
		#...then we assume it must be "http"
			RewriteRule .* - [E=INFO_PROTOCOL:http,NE]
		#Finally, set the protocol header
			RequestHeader set x-orig-protocol "%{INFO_PROTOCOL}e"
	
			
		#Get the request uri and set an environment variable
			RewriteRule .* - [E=INFO_REQUEST_URI:%{REQUEST_URI},NE]
		#Build the whole original url out of the available parts. SCRIPT_URI is always null, otherwise we could have used that.
			RequestHeader set x-orig-url "%{INFO_PROTOCOL}e://%{INFO_HTTP_HOST}e%{INFO_REQUEST_URI}e"
		#In addition make an url with only the host and context, for convenience
			RequestHeader set x-orig-url-base "%{INFO_PROTOCOL}e://%{INFO_HTTP_HOST}e%{INFO_REQUEST_CONTEXT}e"
		
		
	####### REWRITE URL #########################
		# If the acceptheader contains a versionnumber... 
			RewriteCond %{HTTP_ACCEPT} version=(\d+)$ [NC]
		# ..and the requsts does not contain "-v<number>"
			RewriteCond %{REQUEST_URI} "!^.*-v\d+.*$"
		# then insert -v<number> in the context and do a PassThrough to the proxy rules below 
			#older version of the rule RewriteRule ^/([\w\.\-\_]+)/(.+)$ /$1-v%1/$2 [PT]
			RewriteRule (^/.[^/]*)(.*)$ $1-v%1$2 [PT]
		
	####### PROXY SECTION #########################
		#Make sure that no one misuses this as a forward proxy
			ProxyRequests off
		#Pass everything else through to the backend
			ProxyPass / http://localhost:8080/
		#Adjust paths in cookies too		
			ProxyPassReverse / http://localhost:8080/
	</IfModule>
	</IfModule>
	</IfModule>
	</IfModule>
	
Gem indholdet i en separat fil, f.eks. **kasia2.conf**, læg den sammen med de andre .conf filer og inkluder den fra hovedfilen httpd.conf
	ProxyPass / http://localhost:8080/
og			
	ProxyPassReverse / http://localhost:8080/
Skal rettes til så de peger på tomcat hosten. Resten bør der ikke være behov for at pille ved

###Header oversigt

Når man har ovenstående kørende så bliver der sat en del request headers

	x-forwarded-server 	localhost
	x-orig-accept-name 	afsaetning
	x-orig-accept-version 	2
	x-orig-context 	/support
	x-orig-host 	localhost
	x-orig-port 	80
	x-orig-protocol 	http
	x-orig-url 	http://localhost/support/debug.jsp

	x-orig-url-base 	http://localhost/support
	
Det burde være nok at bruge den sidste, men de andre er med just-in-case. Hvis der ikke er behov kan de fjernes ved at udkommentere de tilhørende "RequestHeader set ..." i apache config'en

##Support website
Der er lavet et simpelt website der kan hjælpe med fejlfinding, support og den slags. Der er sider der ser på diverse servervariable, headers og den slags. Der er også sider som med vilje tager lang tid og som vi kan bruge til at teste loadbalancer og fail over med.

Kildekoden findes i infrastruktur projektet på github, under web/support

For at bygge war filen:

	cd WebContent
	jar -cvf ..\support.war *  
	cd ..

For at deploye war filen til tomcat localhost:

	curl --upload-file support.war "http://tomcat:tomcat@localhost:8080/manager/deploy?path=/support&update=true"
	
Når den er deployed kan den rammes på adressen:

	http://localhost:8080/support
	
	