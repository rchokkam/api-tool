{
    "preandprod" : ["localhost","preprod","prod"],
    "accept" : "application/vnd.yousee.kasia2+json;version=",
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
            "label" : "All customers",
            "uri" : "/amsid/<id>",
            "method" : "GET",
            "version" : "1"
        },
        {
            "label" : "Update customer",
            "uri" : "/<id>",
            "method" : "POST",
            "version" : "1",
            "schema" : "update-customer"
        },
        {
            "label" : "Create customer",
            "uri" : "/",
            "method" : "POST",
            "version" : "1",
            "schema" : "create-customer"
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
        }]
    },
    {
        "name" : "ORDRE",
        "context" : "/order",
        "resources" : [{
            "label" : "Find lokation",
            "uri" : "/lokation/<lokation>",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "PRODUKT",
        "context" : "/product",
        "resources" : [{
            "label" : "Find lokation",
            "uri" : "/lokation/<lokation>",
            "method" : "GET",
            "version" : "1"
        }]
    },
    {
        "name" : "PROVISIONING",
        "context" : "/product",
        "resources" : [{
            "label" : "Find lokation",
            "uri" : "/logistik/lokation/<lokation>",
            "method" : "GET",
            "version" : "1"
        }]
    }]
}
