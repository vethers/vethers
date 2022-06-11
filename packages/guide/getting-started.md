# Getting Started

## Introduction

 In china, people perfer use **Vue**, but the ecology of blockchain app develop depends on React ! So I released **Vethers** help Vue developer learn to blockchain app develop ! **Vethers** was inspired by [wagmi](https://wagmi.sh/) ! It is almost the same as Wagmi's api.

## Installation

```
npm install @vethers/core ethers
```

## Quick Start

First, create a vethers `Client` instance using `createClient`.


```ts
import { createClient } from '@vethers/core'

const client = createClient()
```
