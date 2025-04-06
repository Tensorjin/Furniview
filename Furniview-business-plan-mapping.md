# Furniview Business Plan Mapping

```mermaid
graph TD
    A[Business Overview] --> B[Product Design]
    A --> C[Business Model]
    A --> D[Go-to-Market]
    A --> E[Risk Assessment]
    
    subgraph Business Overview
        A1[Value Proposition]
        A2[Market Analysis]
    end
    
    subgraph Product Design
        B1[User Experience Flows]
        B2[Key Features]
    end
    
    subgraph Business Model
        C1[Revenue Streams]
        C2[Cost Structure]
        C3[Pricing Strategy]
    end
    
    subgraph Go-to-Market
        D1[Marketing Strategy]
        D2[Growth Phases]
    end
    
    subgraph Risk Assessment
        E1[Challenges]
        E2[Mitigation Strategies]
    end
    
    B1 -->|Feeds Into| C1
    C1 -->|Supports| D1
    D1 -->|Addresses| E1
    E2 -->|Informs| B2
