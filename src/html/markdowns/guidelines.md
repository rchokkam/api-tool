# Welcome to the Kasia2 documentation site. 

The intention of this site is to give a starting point to use the Kasia2 application interface to Yousee data as well as the formal specification on how you can call it. In the Guidelines section you will find overall descriptions and information on how to use the Kasia2 services. And for each service there is an specific API specification and a Release note. 

This information is the current - and only - information of the kasia2 API's.

Kasia2 delivers a REST based interface that can be called from 'client side' applications.

REST can be described very simple:
 
    Use standard HTTP methods to call a service with parameters, get a json reply.
    Check the standard response code to verify each call.
    Use the provided links and information to proceed with new calls. 

You should read this: http://martinfowler.com/articles/richardsonMaturityModel.html   

To get even more 'REST' understanding please read the book: 'REST in Practice': http://restinpractice.com.

In the Kasia2 usage information (REST) chapter a more specific Kasia2 description can be found.

If this site do not answer your question or if it is unclear please contact YIIJ or YIIR/S

# Guidelines for client developers
Content [TOC]
## Kasia2 general information
**intentions**

Kaisa is meant as the integration point of all IT systems. It is inserted as a layer between client applications and the underlying database and system infrastructure. This is done to enable a stepwise change/optimization of the current structure. And to have a single point where to control business rules and separate them from the current data layers.

**clojure**

The logic of Kasia2 is coded in a high level - lisp like - language based on the Java platform. This language - called Clojure - is very compact and enables a very structural approach of coding. Where business logic can be clearly separated from the technical layers.

**array**

To further separate business logic from the code, a decision support matrix product 'Array' has been implemented. Based on the current product and price data a model is generated and used in the services code whenever the rules of product sale needs to be confirmed. Meaning that whenever business (sales) decisions are changed it only need to be updated in the 'Array' model and not in the coding.

### Current clients
Current client (users) of Kasia2 are: Triple, Kasia classic, YKW, Forhandlerweb, YK bestillingsflow, Service Center, Bier (Adapt) and YSPro.

* https://yousee.jira.com/wiki/display/KASIATWO/kasia2+klienter

**Clients corner**

* share your code examples
   * clojure client
   * ykw sitecore
   * castiron

### Documentation
The documentation is live and follow the code. So it should be up to date and defines the current API.

For each service there is an API chapter that describes the service provided, the methods supported, lists of resources, response codes and some examples of requests and responses.

Some business terms are in danish. This is intentional to avoid misunderstandings and deviations from the Yousee standard.

Note that the examples are static I.E. they may be outdated and keys may be wrong

There is also release information for each service specifying the changes that have been done with each release.

The current code version can be found at the bottom of the API pages.

### Deployment plan
Normally bugfixes and minor code versions are deployed biweekly.

This is done 'rolling' I.E. with no downtime, unless needed because of larger changes

Examples of this could be larger DB changes or major changes to the infrastructure.

### Bugs
Bugs should be reported in jira. See Links section.

### Host names
The official hostnames are for production:
 
    kasia.yousee.dk 
and for Preproduction: 

    preprod-kasia.yousee.dk. 
But note that the access are limited to some specific servers (IP's) that are allowed in the firewall. And some - but not all - of the proxy servers on the tdk koncern network.

You found your way here so you know how to access this server. Use the jira link below to find other environments

## Kasia2 usage information (REST specific)
### Accept header
All service API's expects a 'contract' in form of a media type specified in an 'Accept' header in this form 

    application/vnd.yousee.kasia2.<service>+json;version=<version> 

I.E. 

    application/vnd.yousee.kasia2.kunde+json;version=1
If this is not specified you will get an 404 or a 406 return code.

### API version
The version in the accept header reflects the API version and specifies the way the cliens can communicate with the service. 

It is expected that the client sets the accept header version to the version that it (the client) is using.

**kasia2 backward compatible**

New versions will only be released when needed. It could be due to changes in the current API or due to major business rule changes. But changes that only corrects errors or adds new resources will use the same version of the API.

**Old versions live how long?**

Old versions will be available for about 3 months after the release of a newer one to give the client time to change into the new version.

**client forward compatible**

The client software should be coded forward compatible by eg. not give errors when extra fields appear or depend on ordering, numbering or counts of outputs.

### Method description
Each service will support a set of standard REST (http) methods.  

Here is a short definition:

* `GET uri/<id>` will 'fetch' a given resource. It is safe and idempotent and it will return an 'ETag' header.
* `DELETE uri/<id>` will delete or cancel the resource. It is not safe or idempotent. It is expected that the client sets the 'IF-Match' header with the value of the 'ETag' from the last response.
* `PUT uri + <json body>` will update the resource mentioned in the body. To be idempotent all information on the resource needs to be in the body. It will not be safe though. It is expected that the client sets the 'If-Match' header with the value of the 'ETag' from the last response to verify if other updates has been done since the last GET.
* `POST uri/<id> + json body` will partly update the resource <id>. It is not safe or idempotent. It is expected that the client sets the 'If-Match' header with the value of the 'ETag' from the last response to verify if other updates has been done since the last GET.
* `OPTIONS uri` to give information about a service. This is not supported.

The 'uri' is the service name. See the API description page for each service.

### Return codes used in Kasia2
For a full description see w3c: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html

 Code | Name | Status
------|-------------|-------
200 | OK | Success
201 | Created | Success
400 | Bad request | Client Error
403 | Forbidden | Client Error
404 | Not found | Client Error
406 | Not Acceptable | Error in accept header
409 | Conflict | Client Error
412 | Precondition Failed | Client Error
500 | Connection refused | Service error (try again)
503 | Server error | Service error



**404 and 503 note**

Even that you may be used to see these errors as 'system' errors, please note that these errors can also come from the application itself. Fx. if a given `<id>` does not exist it will return 404.

### Content types returned
* Normally the Content Type returned is the same as the Accept header.
* If error code is given the type returned is: application/vnd.yousee.kasia2.error+json

### Alive
In each application there is a check build in: 

* `GET uri/alive` 
This check will verify if all interfaces that the service uses/depend on are available and working.

It also prints all the connect information that this specific service uses

### Code versions
The current version of the code can be seen on each API page a the bottom of the page.

### Json
Nearly all request returns a json document. They cannot be seen in browsers easily, but check 'dev tools' to get info on how to see them. In your application you should use a library that supports the syntax.

### Character set
All the API content is in UTF-8

### Internal URL's
In the documentation there may be marked some Internal information. This is for debugging and control. Please ask a kasia2 developer before you use it.

## Links
* Martin Fowler has a short an nice [introduction](http://martinfowler.com/articles/richardsonMaturityModel.html)
* also try reading [this](http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) which is the dissertation of Thomas Fielding
* W3C [rfc2616 REST codes](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
* Read the book ['REST in practice'](http://restinpractice.com)
* [Hostnames and Environments URL's](https://yousee.jira.com/wiki/display/KASIATWO/Environments+URL+overview)

Array  

* Array description [www.arraytechnology.com](http://www.arraytechnology.com)
* [OEM Runtime Engine](http://www.arraytechnology.com/products/oem-runtime-engine.aspx)

clojure  

* [Clojure.org](http://clojure.org/)

Bug reporting and clients  


* bug reporting [jira](https://yousee.jira.com/browse/KASIATWO)
* Current [kasia2 clients](https://yousee.jira.com/wiki/display/KASIATWO/kasia2+klienter)

## Client development tools
**proxy**

Due to the firewall restrictions you may need to set a specific proxy in your 'tool'. Use pxrtgl02.tdk.dk 8080. Note that a tool can be firefox and the IE browser but also java or native clients that needs to have a proxy set in their own way.

**REST client**

Install the 'REST Client' firefox plugin. It is a must!

**jquery**

Can be used as a client. It has json parser and can set the Accept header. Please ask for an example.

**logfiles**

If you cannot understand why you cannot get your requests working ask YIIJ to look in the services log files. On preproduction we log all requests and replies (or we can switch it on).

**curl**

Get the 'curl' tool! Available in Windows and unix versions.

* use -H 'accept: application...version=1'
* use -X to use PUT and POST
* use -d to give a json body for put and post

**json indent/pretty print**

A unix example to 'format' the json output using 'indent' (it is not perfect but useful):

    curl -s -H "accept: application/vnd.yousee.kasia2.afsaetning+json;version=1" 
     http://preprod-kasia.yousee.dk/afsaetning/853224/1/K/600150744|indent