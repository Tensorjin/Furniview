# Phase 4: Future AI Enhancements (Post-MVP)

**Purpose**: Explore AI capabilities to further enhance the platform's value after the core MVP is stable and launched.

**Note**: These tasks involve significant technical complexity, research, potential costs, and challenges regarding accuracy and reliability. They should be approached iteratively with clear goals and validation steps.

**Potential Tasks**:

1.  **AI-Generated Assembly Videos**:
    *   **Goal**: Automatically generate video walkthroughs based on the interactive 3D assembly steps defined for a furniture item.
    *   **Input Data Requirements**: Needs a well-defined, structured representation of the assembly sequence, likely derived from GLTF animation data or a custom format stored alongside it. This structure must include:
        *   Per-step part identifiers.
        *   Per-step transformations (position, rotation, scale) for each active part.
        *   Defined camera angles/paths for each step (or logic to calculate optimal views).
        *   Optional: Information for highlighting active parts or adding annotations/callouts.
    *   **Potential Technical Approaches**:
        *   *A) Game Engine Automation:* Utilize Unity or Unreal Engine. Create a template scene, load the GLTF model via script, programmatically drive the animations based on the input sequence data, control camera movements, and use built-in recording tools (e.g., Unity Recorder) to export video frames or sequences. Requires setting up dedicated build/render machines (potentially cloud-based with GPUs).
        *   *B) Blender Scripting:* Leverage Blender's Python API (`bpy`). Script the loading of the GLTF, application of step-by-step transformations, camera positioning, and rendering via Cycles or Eevee. Can be run headlessly on servers, but rendering (especially high-quality) can be time-consuming.
        *   *C) AI Video Generation Platforms:* Explore APIs from platforms like RunwayML, Kaiber, or future specialized tools that might allow generating video from 3D scene descriptions or animation data. Assess API capabilities, control limitations, quality, and cost. Likely less control than A or B.
    *   **Implementation**:
        *   Requires a dedicated backend processing service (likely Python-based) to manage the chosen approach (interfacing with Blender/Game Engine/AI API).
        *   Requires robust job queueing and status tracking for potentially long-running video generation tasks.
        *   Needs modifications to the `furniture` data model or associated metadata to store the structured assembly sequence if not fully derivable from GLTF animations.
        *   Requires frontend components for initiating video generation (optional), displaying progress/status, and embedding/playing the final video.
        *   Implement thorough error handling for generation failures and a potential manual review/approval step before videos are made public.
    *   **Validation Metrics**: Generation success rate, percentage of steps accurately represented, visual clarity/correctness (camera angles, part highlighting), average generation time per step, cost per generated video minute.
    *   **Challenges**: Defining optimal camera paths automatically, ensuring smooth visual transitions between steps, handling complex multi-part steps, managing rendering time and cost, maintaining visual consistency.

2.  **AI 2D-to-3D Instruction Generation**:
    *   **Goal**: Interpret uploaded 2D instruction manuals (PDFs, images) and automatically generate a *draft* 3D assembly sequence, significantly reducing manual setup time for companies while requiring user validation and refinement.
    *   **Potential Pipeline Stages**:
        1.  *Input:* Company uploads PDF or image files of their existing 2D manual.
        2.  *Preprocessing:* PDF parsing (extracting text and images), image cleanup/enhancement (e.g., using OpenCV). Page segmentation to separate diagrams, text blocks, part lists.
        3.  *Diagram Analysis (Computer Vision):*
            *   *Component Detection:* Use object detection models (e.g., fine-tuned YOLOv5/v8, Detectron2) trained on furniture parts/fasteners to identify components within each diagram.
            *   *Layout/Relationship Analysis:* Analyze spatial relationships between detected components (adjacency, alignment, containment). Potentially use Graph Neural Networks or rule-based systems to infer connections (e.g., "Screw C connects Part A and Part B"). Identify indicators like arrows or exploded views.
        4.  *Text Analysis (NLP):*
            *   *Part List Extraction:* Extract part names/codes and quantities from text lists.
            *   *Instruction Parsing:* Parse step-by-step text instructions (e.g., using spaCy, NLTK, or transformer models) to identify actions, parts involved, and sequence.
            *   *Cross-Referencing:* Link text references (e.g., "Part A", "Screw C") to components detected in diagrams.
        5.  *3D Sequence Generation (Core R&D):* Synthesize information from diagram and text analysis to generate a structured sequence. This involves:
            *   Matching detected 2D parts to a library of known 3D component models (or generating placeholder geometry).
            *   Inferring 3D positions/orientations based on 2D layout and assembly logic.
            *   Ordering steps based on text instructions and diagram flow.
            *   Outputting a draft sequence (e.g., custom JSON format or annotated GLTF).
    *   **Implementation**:
        *   Requires a complex backend processing pipeline (likely Python with libraries like OpenCV, PyMuPDF, PyTorch/TensorFlow, spaCy, networkx).
        *   Needs a robust UI for companies to upload 2D manuals.
        *   **Crucially:** Requires a sophisticated frontend editor allowing companies to easily review, correct, and refine the AI-generated draft sequence (correcting part identification, adjusting 3D positions/rotations, reordering/modifying steps, adding missing details). The AI output is only a starting point.
        *   Implement robust error handling for each pipeline stage and clear communication to users about the draft nature and expected need for manual adjustments.
    *   **Proof-of-Concept (PoC) Strategy**:
        *   *Prioritize building internal PoCs:* Start with validating specific, high-risk stages first.
        *   *Example PoC Goals:* "Accurately detect >80% of standard fasteners (screws, bolts) in sample diagrams," "Correctly identify main structural parts in >70% of single-step diagrams," "Extract part list with >90% accuracy from sample PDFs," "Generate topologically plausible 3D placement for simple 2-part assembly steps based on diagram analysis."
    *   **Challenges**: High technical complexity (state-of-the-art CV/NLP needed), ambiguity and variability in 2D manual formats/styles, need for large labeled training datasets (potentially custom-built), difficulty in accurately inferring 3D geometry and relationships from 2D, significant R&D investment, managing user expectations about automation level.

**General Considerations for AI Features**:
*   **Data Requirements & Acquisition Strategies**:
    *   **AI Video Generation:**
        *   *Requirement:* Primarily needs high-quality, structured assembly sequence data as *input*, not necessarily for training an AI model in the traditional sense (unless using a model that learns animation styles). This input includes per-step part IDs, transformations, and ideally defined camera paths/logic.
        *   *Acquisition:* This structured data must be generated/defined during the creation or refinement of the 3D instructions on the Furniview platform itself. The quality relies heavily on how well the assembly steps are captured digitally. Data might originate from GLTF animation tracks or a custom data structure.
    *   **AI 2D-to-3D Generation:**
        *   *Requirement (Significant):* This feature heavily relies on large, diverse, and accurately labeled datasets for training the computer vision (CV) and potentially NLP models involved. Key datasets needed include:
            *   *Component Detection:* Images of 2D diagram sections labeled with bounding boxes and class names for various furniture parts (panels, screws, dowels, cams, etc.) across diverse styles, views, and levels of detail.
            *   *Layout/Relationship Analysis:* Labeled data indicating spatial relationships (connectivity, alignment, containment) between detected components in diagrams. May also need data linking diagram elements to textual references (e.g., "Part A").
            *   *Sequence Generation (Optional/Advanced):* Paired examples of 2D instruction steps (diagram + text) and their corresponding target 3D part placements/transformations.
        *   *Acquisition Strategies (Challenging):*
            *   *Internal Labeling:* Manually annotate a diverse set of 2D manuals from various sources (requires significant human effort and domain expertise). Prioritize common furniture types and assembly steps first.
            *   *Synthetic Data Generation:* Programmatically create simplified 3D assembly scenes, render them into 2D diagram-like views, and automatically generate corresponding labels. Useful for bootstrapping but may lack real-world complexity and style variations.
            *   *Leverage Existing Platform Data:* Once Furniview has user-generated 3D instructions, potentially use these (with permission and anonymization) to generate paired 2D views and labels, creating a valuable internal dataset over time.
            *   *Public Datasets:* Investigate academic datasets (e.g., technical drawings, 3D model repositories like ShapeNet) but expect significant gaps in assembly-specific labeling.
            *   *Partnerships/Data Sharing:* Collaborate with willing furniture companies to access and label their existing 2D manuals (requires clear data usage agreements).
            *   *Iterative Approach:* Start PoCs with smaller, focused datasets (e.g., only common fasteners and panel connections) and expand data collection based on initial results and identified model weaknesses.
*   **Cost**: AI model training and inference can be computationally expensive. Factor in API costs or infrastructure requirements.
*   **Accuracy & Reliability**: AI outputs may not always be perfect. Plan for validation, potential manual correction workflows, and managing user expectations.
*   **Iterative Development**: Start with small, focused proof-of-concepts before committing to full feature development.
