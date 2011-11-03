(defproject api "1.0.0-SNAPSHOT"
  :description "API Tool For Kasia2.0"
  :dependencies [[org.clojure/clojure "1.2.0"]
                 [compojure "0.6.2"]
                 [ring/ring-core "0.3.7" :exclusions [javax.servlet/servlet-api]]
                 [ring/ring-servlet "0.3.7" :exclusions [javax.servlet/servlet-api]]
                 [ring-json-params "0.1.3"]
                 [ring-common "1.0.7"]]
  :dev-dependencies [[uk.org.alienscience/leiningen-war "0.0.12"]
		     [swank-clojure "1.2.1"]
		     [ring/ring-jetty-adapter "0.3.7"]
		     [org.mortbay.jetty/jetty-plus "6.1.14"]
		     [org.mortbay.jetty/jetty-naming "6.1.14"]
                     [ring/ring-devel "0.3.7"]
                     [lein-lazytest "1.0.1"]
		     [com.stuartsierra/lazytest "1.1.2"]
		     [javax.servlet/servlet-api "2.5"]
		     [com.stuartsierra/lazytest "1.1.2"]
		     [autodoc "0.7.1" :exclusions [org.clojure/clojure.contrib ant]]
		     [lein-run "1.0.0"]]
  :war {})