<img src="/logo.svg" width="128px" height="128px" />

[![Docker](https://github.com/thepeoples/website/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/thepeoples/website/actions/workflows/docker-publish.yml)

## Introduction

This is the official documentation for the platform instance used to host services provided by `thepeoples.io` domain.
Each platform instance is a self-contained collection of highly-available applications and services.
User data stored within each platform instance is protected with privacy-preserving encryption and fine-grained access
controls.
Data can be globally replicated across platform instances, giving applications the ability to be globally distributed.

## Logical Architectural Layers

### Infrastructure

The hardware being used to host the platform.
Infrastructure can be hosted anywhere that is accessible to the desired user base.

An "infrastructure instance" represents one Kubernetes cluster meeting the **Minimum Infrastructure Instance
Requirements**.

### Platform

The software consuming the infrastructure in order to provide end-users with desired services.

A "platform instance" is a collection of one or more infrastructure instances that the platform manages to provide
high-availability and data privacy.
An example of a platform instance is `thepeoples.io`.

A "platform instance provider" is an entity that provides platform instances as a service.
One goal of this solution is to secure data at the platform instance (i.e. application) level instead of delegating that
task to the underlying infrastructure.
This ensures that data cannot be altered, indexed, read, or otherwise scanned without the consent of the owner.

## Core Principals

Where practical (and possible), the following guiding principles should be followed:

* Data privacy is just as important as the free flow of information provided by the Internet
* Security is a design consideration from the start but should not overly disrupt the user experience
* Smaller, more decentralized circles of trust should be preferred over larger, one-size-fits-all solutions
* Build for high-availability and horizontal scalability, even if the platform instance contains only a single
  infrastructure host
* Privacy-ensuring (i.e. client-side) data encryption and residency options should come standard
* Allow secure, transparent connections between platform instances without needing to trust their infrastructure
* Families and communities should be able to self-host the same platform that powers `thepeoples.io`
* Connect communities together while maintaining encryption, privacy, and ownership of managed data
* Users of various technical backgrounds should find the experience intuitive
* Users should require only limited trust in their chosen platform instance providers, and may safely choose to switch
  providers later
* Simplicity and smaller attack-surfaces should be preferred over larger, more complicated components
* Component implementations should be small, modular, and pluggable/swappable
* Use industry best-practices, such as GitOps and least-privileged access models

### Bottom Line

Secure your data, whether hosting it yourself or using a third party platform instance provider.
This project hopes to decentralize web services through federation of distributed instances of the current reference
architecture called:
**The Peoples' Infrastructure and Services Platform**

## Status

### 🚧 Under Construction: Phase 1

The implementation of Phase 1 is nearly complete!

#### Phase 1 - Infrastructure

Design, build, and document the standard feature set that the platform requires from infrastructure instances.

Standard features of the infrastructure:

* Container orchestration
* Secrets management
* Ingress traffic routing
* Automated management of TLS certificates
* High-availability of workloads

**NOTE**: The work on the end-user experience via APIs and UIs will start after completion of Phase 2.
This means features like data backup/restore, encryption, retention, etc will be handled at the platform layer.

#### Phase 2 - Platform Foundation

The foundation of the platform that will serve end users and protect their data.
These are the low-level services required to build applications and services on the platform.

Focus on the basics of building a persistent storage layer with client-side encryption as a standard feature.
This phase should also consider the future multi-region use-cases.
Initially, persistent storage will remain limited to KV-like (NoSQL) databases for all platform services.

* `storage-s3-api`: Low-level S3 storage abstraction API to enforce data privacy using client-side encryption
* `storage-kv-api`: KV storage API built on `storage-s3-api`, with indexing and querying capabilities

##### Persistent Storage API Design Goals

* Vendor-agnostic, easy to globally replicate object storage
* Must support at least one open storage API commonly available from third-party providers
* Storage backends must encrypt user data before it leaves the logical platform boundary
    * Remove as much trust as possible from infrastructure instances
        * Assume all `PersistentVolumes` are vulnerable to data leakage
    * Remove as much trust as possible from third-party storage providers
        * Always use client-side encryption
        * Never delegate the crucial task of encrypting data to an outside service

Traditional SQL databases, while excellent RDBMS systems, are too difficult to configure properly (if not impossible) at
this time, based on current core principals and design goals.
Potential open source solutions currently worth exploring:

* [TiDB](https://github.com/pingcap/tidb)
    * [TiDB for PostgreSQL](https://github.com/DigitalChinaOpenSource/TiDB-for-PostgreSQL)

#### Phase 3 - Platform API Experience

With the persistent storage problem solved, work can begin on the end-user experience.
This means actually building and exposing APIs that will provide value to end users whether directly, or through usage
of the web UI.
The development of the web UI will begin once API designs are finalized.

#### Phase 4 - Platform UI Experience

With stable APIs to work with, the web-based user interface can be built:

* Seamless, unified, and user-friendly web UI
    * Custom interface using Deno + Fresh?
* OIDC-compatible authentication provider using `storage-kv-api` for backend storage
    * Example reference products: Keycloak

Combined with the previous phase, this phase will provide the framework for applications to build on top of the platform
to provide end users with desired services.
The platform becomes stable for building applications and services on near the end of phase 4.
Phase 5 is where end-user value-add velocity begins to ramp up.

#### Phase 5 - Applications

The ultimate goal is to stabilize the code base and the management of the platform before building the end user
applications.
This is a list of potential services that could be made available via applications with enough desire from end users:

* Static websites
    * Example references: this one!
* Video streaming cache and viewing
    * Example reference products: FreeTube, Invidious
* Federated, real-time, secure communications between users and services
    * Example reference products: Matrix, Signal
* DNS server for allowing low-level web content filtering
    * Example reference products: AdGuard, PiHole, PowerDNS
* Allow users to securely share documents, files, and photos across their devices
    * Example reference products: next/ownCloud, WebDAV
* Collaborative markup document editing
    * Example reference products: EtherPad
* Collaborative spreadsheet editing
    * Example reference products: ReactGrid, HyperFormula
* IoT and user physical environment automation
    * Example reference products: HomeAssistant

With the correct infrastructure, and foundational services provided by the platform, there is unlimited potential for
additional applications and features that can be added in the future.

#### Phase 6 - Application Developer Experience

Development of the platform and its applications largely depends on external service providers.
This phase will focus on reducing the third party risk associated with platform sustainability:

* Source code repositories
    * Example reference products: GitHub, GitLab, Gitea
* Container image registries
    * Example reference products: DockerHub, Quay.io

#### Potential Future Phases

Because these problems can be difficult to solve, and priorities change, some items may get more attention than others:

* Identity and data federation across platform instances to allow for decentralization
    * No known reference products
* Multi-region infrastructure instances for a platform
    * Example reference products: KubeEdge, Open Cluster Management
* Global, geographic load balancing of Internet traffic to platform
    * No known reference products

## FAQ

* Why is this still empty?
    * No idea, but if you do, please think about contributing 🙂

## Contributing

See [the building docs](./local-development) for how to build and test this container locally.
Issues and PRs are open for asking questions or sharing ideas and proposals.
The goal is for this to become a community-owned solution that uses GitOps patterns where ever practical, including for
project and solution governance.

## Source Code

The source code for the platform is open source. Please visit our source repository for more information:

https://github.com/thepeoples/website

## Branding

Current branding is based on an [idea from ChatGPT](./ai-branding-idea).
