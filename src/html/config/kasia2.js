{
    "preandprod" : ["preprod-kasia.tdk.dk","kasia.tdk.dk","preprod-kasia.yousee.dk","kasia.yousee.dk","preprod-kasia","kasia"],
    "accept" : "application/vnd.yousee.kasia2+json;charset=UTF-8;version=1",
    "rel" : {
        "opret" : "PUT",
        "opdater" : "PUT",
        "slet" : "PUT",
        "opsig" : "PUT",
        "vaelg-aftale" : "PUT",
        "fjern-advarsler" : "PUT",
        "bestil" : "POST"
    },
    "modules" : [{
        "name" : "ABONNEMENT",
        "context" : "/abonnement",
        "docs" : [{
            "label" : "API",
            "uri" : "/public/API.html",
            "version" : "1"
        },
        {
            "label" : "Release Notes",
            "uri" : "/public/release-notes.html",
            "version" : "1"
        }],
        "resources" : [{
            "label" : "All abonnementer by kundeid",
            "uri" : "/kunde/<kundeid>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "All abonnementer in a specific aftale",
            "uri" : "/aftale/<aftalenr>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "All abonnementer for a specific customer",
            "uri" : "/<kundeid>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "All abonnementer for a specific aftale",
            "uri" : "/<kundeid>/<aftalenr>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "All abonnementer with a specific varenummer",
            "uri" : "/<kundeid>/<aftalenr>/<varenr>",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "ADRESSE",
        "context" : "/adresse",
        "docs" : [{
            "label" : "API",
            "uri" : "/public/API.html",
            "version" : "1"
        },
        {
            "label" : "Release Notes",
            "uri" : "/public/release-notes.html",
            "version" : "1"
        }],
        "resources" : [{
            "label" : "Find by zip",
            "uri" : "/find/<zip>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Address",
            "uri" : "/<amsid>",
            "method" : "GET",
            "version" : "1"
        },      
        {
            "label" : "Find by street",
            "uri" : "/find/<postnr>/<street>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Find by housenumber",
            "uri" : "/find/<postnr>/<street>/<housenumber>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Installation",
            "uri" : "/installationer/<amsid>",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "AFS\u00c6TNING",
        "context" : "/afsaetning",
        "docs" : [{
            "label" : "API",
            "uri" : "/public/API.html",
            "version" : "1"
        },
        {
            "label" : "Release Notes",
            "uri" : "/public/release-notes.html",
            "version" : "1"
        }],
        "resources" : [{
            "label" : "Afsaetning",
            "uri" : "/<amsid>/<instnr>/<salgskanal>/[kundeid]",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Priser",
            "uri" : "/priser/<anlaegsid>/<salgskanal>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Priser with mindstepriser",
            "uri" : "/priser/<anlaegsid>/<salgskanal>/<boligtype>/<stikstatus>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Prisgruppe",
            "uri" : "/priser/<anlaegsid>/<salgskanal>/<prisgruppe>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Prisgruppe with mindstepriser",
            "uri" : "/priser/<anlaegsid>/<salgskanal>/<prisgruppe>/<boligtype>/<stikstatus>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Nysalgs priser",
            "uri" : "/priser/nysalg/<anlaegsid>/<salgskanal>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Nysalgs priser with mindstepriser",
            "uri" : "/priser/nysalg/<anlaegsid>/<salgskanal>/<boligtype>/<stikstatus>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Mindstepris",
            "uri" : "/mindstepris-beregning/<price-id>/<anlaegsid>/<boligtype>/<stikstatus>/<nysalg>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Pakkeindhold",
            "uri" : "/pakkeindhold/<anlaegsid>/<pakke>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Pakker",
            "uri" : "/findprogram/<anlaegsid>/<program>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Find telefonnummer",
            "uri" : "/findtelefonnummer/<sequence>/<count>",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "KUNDE",
        "context" : "/kunde",
        "docs" : [{
            "label" : "API",
            "uri" : "/public/API.html",
            "version" : "1"
        },
        {
            "label" : "SSO API",
            "uri" : "/public/SSO-API.html",
            "version" : "1"
        },
        {
            "label" : "Release Notes",
            "uri" : "/public/release-notes.html",
            "version" : "1"
        }],
        "resources" : [{
            "label" : "Find kunde",
            "uri" : "/<id>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "All kunder with amsid",
            "uri" : "/amsid/<id>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Update kunde",
            "uri" : "/<id>",
            "method" : "POST",
            "version" : "1",
            "schema" : "kunde-update-customer"
        },
        {
            "label" : "Create kunde",
            "uri" : "/",
            "method" : "POST",
            "version" : "1",
            "schema" : "kunde-create-customer"
        },
        {
            "label" : "Find best kunde match",
            "uri" : "/bedste-match/<amsid>/<fornavn>/<efternavn>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Find SSO with KundeId",
            "uri" : "/<id>/sso",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Create SSO",
            "uri" : "/sso",
            "method" : "POST",
            "version" : "1",
            "schema" : "kunde-create-sso"
        },
        {
            "label" : "Update SSO with Kundeid",
            "uri" : "/<id>/sso",
            "method" : "POST",
            "version" : "1",
            "schema" : "kunde-update-sso"
        },
        {
            "label" : "Show current atom feed for sso",
            "uri" : "/sso/notifications",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "LOGISTIK",
        "context" : "/logistik",
        "docs" : [{
            "label" : "API",
            "uri" : "/public/API.html",
            "version" : "1"
        },
        {
            "label" : "Release Notes",
            "uri" : "/public/release-notes.html",
            "version" : "1"
        }],
        "resources" : [{
            "label" : "Find hardware by lokation",
            "uri" : "/lokation/<lokation>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Find hardware by serienummer",
            "uri" : "/hardware/<serienummer>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Opret lagerordre",
            "uri" : "/lagerordre",
            "method" : "POST",
            "version" : "1",
            "schema" : "logistik-create-lagerordre"
        },
        {
            "label" : "Varemodtagelse",
            "uri" : "/varemodtagelse",
            "method" : "POST",
            "version" : "1",
            "schema" : "logistik-create-varemodtagelse"
        },
        {
            "label" : "Ombytning",
            "uri" : "/ombytning",
            "method" : "POST",
            "version" : "1",
            "schema" : "logistik-create-ombytning"
        },
        {
            "label" : "Indlevering",
            "uri" : "/indlevering",
            "method" : "POST",
            "version" : "1",
            "schema" : "logistik-create-indlevering"
        },
        {
            "label" : "Omregistrering",
            "uri" : "/omregistrering",
            "method" : "POST",
            "version" : "1",
            "schema" : "logistik-create-omregistrering"
        }]
    },
    {
        "name" : "ORDRE",
        "context" : "/ordre",
        "docs" : [{
            "label" : "API",
            "uri" : "/public/API.html",
            "version" : "1"
        },
        {
            "label" : "Release Notes",
            "uri" : "/public/release-notes.html",
            "version" : "1"
        }],
        "resources" : [{
            "label" : "Get ordre by UUID",
            "uri" : "/<uuid>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Get ordre receipt by UUID",
            "uri" : "/receipt/<uuid>",
            "method" : "GET",
            "version" : "1"        
        },
        {
            "label" : "Get ordre by kundeID",
            "uri" : "/<kundeid>",
            "method" : "GET",
            "version" : "1"        
        },
        {
            "label" : "Notifications (ATOM feed)",
            "uri" : "/notifications",
            "method" : "GET",
            "version" : "1"        
        },
        {
            "label" : "Create ordre",
            "uri" : "/",
            "method" : "POST",
            "version" : "1",
            "schema" : "post-order"        
        }]
    },
    {
        "name" : "PRODUKT",
        "context" : "/produkt",
        "docs" : [{
            "label" : "API",
            "uri" : "/public/API.html",
            "version" : "1"
        },
        {
            "label" : "Release Notes",
            "uri" : "/public/release-notes.html",
            "version" : "1"
        }],
        "resources" : [{
            "label" : "Get produkt by varenummer",
            "uri" : "/<productkey>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Get produkter by varenumre",
            "uri" : "/<productkey1+productkey2>",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "PROVISIONERING",
        "context" : "/provisionering",
        "docs" : [{
            "label" : "API",
            "uri" : "/public/API.html",
            "version" : "1"
        },
        {
            "label" : "Release Notes",
            "uri" : "/public/release-notes.html",
            "version" : "1"
        }],
        "resources" : [{
            "label" : "Create a TAYS provisionerings event",
            "uri" : "/tays",
            "method" : "POST",
            "version" : "1",
            "schema" : "provisionering-create-tays"
        },
        {
            "label" : "Notifications (Atom feed)",
            "uri" : "/tays",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Create a TAYS REPLY Provisionering event",
            "uri" : "/tays/reply",
            "method" : "POST",
            "version" : "1",
            "schema" : "provisionering-create-taysreply"
        },
        {
            "label" : "Show atom feed for TAYS REPLY Provisionering Manager",
            "uri" : "/tays/reply",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Create a VAS Provisionering event",
            "uri" : "/vas",
            "method" : "POST",
            "version" : "1",
            "schema" : "provisionering-create-vas"
        },
        {
            "label" : "Show atom feed for Vas Provisionering Manager",
            "uri" : "/vas",
            "method" : "GET",
            "version" : "1"
        }]
    }]
}
