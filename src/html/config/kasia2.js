{
    "preandprod" : ["preprod","prod"],
    "accept" : "application/vnd.yousee.kasia2+json;charset=UTF-8",
    "modules" : [{
        "name" : "Abonnementer",
        "context" : "/abonnement",
        "resources" : [{
            "label" : "All abonnementer for a Customer",
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
        "name" : "Address",
        "context" : "/adresse",
        "resources" : [{
            "label" : "Find by zip",
            "uri" : "/find/<zip>",
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
            "label" : "Direct address",
            "uri" : "/<amsid>",
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
        "resources" : [{
            "label" : "Afsaetnings resource",
            "uri" : "/<amsid>/<instnr>/<salgskanal>/[kundeid]",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Default call",
            "uri" : "/priser/<anlaegsid>/<salgskanal>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Default call with mindstepriser",
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
            "label" : "prisgruppe with mindstepriser",
            "uri" : "/priser/<anlaegsid>/<salgskanal>/<prisgruppe>/<boligtype>/<stikstatus>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Nysalgs prices",
            "uri" : "/priser/nysalg/<anlaegsid>/<salgskanal>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Nysalgs prices with mindstepriser",
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
            "label" : "Frit valg",
            "uri" : "/pakkeindhold/<anlaegsid>/<pakke>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Find all package programs",
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
        "resources" : [{
            "label" : "Find customer",
            "uri" : "/<id>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "All customers with AMS id",
            "uri" : "/amsid/<id>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Update customer",
            "uri" : "/<id>",
            "method" : "POST",
            "version" : "1",
            "schema" : "kunde-update-customer"
        },
        {
            "label" : "Create customer",
            "uri" : "/",
            "method" : "POST",
            "version" : "1",
            "schema" : "kunde-create-customer"
        },
        {
            "label" : "Find best customer match",
            "uri" : "/<amsid>/<fornavn>/<efternavn>",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "Logistik",
        "context" : "/logistik",
        "resources" : [{
            "label" : "Find lokation",
            "uri" : "/lokation/<lokation>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Find lokation",
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
            "label" : "varemodtagelse",
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
            "schema" : "logistik-create-Indlevering"
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
        "context" : "/order",
        "resources" : [{
            "label" : "Get order by UUID",
            "uri" : "/<uuid>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Get order receipt by UUID",
            "uri" : "/receipt/<uuid>",
            "method" : "GET",
            "version" : "1"        
        },
        {
            "label" : "Post order",
            "uri" : "/",
            "method" : "POST",
            "version" : "1",
            "schema" : "post-order"        
        }]
    },
    {
        "name" : "PRODUKT",
        "context" : "/product",
        "resources" : [{
            "label" : "Get products by product key(s)",
            "uri" : "/<productkey>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Get multiple product keys",
            "uri" : "/<productkey1+productkey2>",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "PROVISIONING",
        "context" : "/product",
        "resources" : [{
            "label" : "Create a Provisioning event",
            "uri" : "/provisioning/vas",
            "method" : "POST",
            "version" : "1",
            "schema" : "provisioning-create-event"
        }]
    }]
}
