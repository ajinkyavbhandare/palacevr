# Immersive 180° VR Video Conversion Pipeline

![Palace x Palace Studio Collab Image](https://raw.githubusercontent.com/ajinkyavbhandare/projects/main/images/palace_x_palace_studio.png)

This repository contains the source code for a video processing pipeline that converts standard 2D videos into an immersive 180° VR format. The project includes a Next.js frontend for file uploads and a Python backend for video processing.

A live demonstration is available at: [https://palacevr.vercel.app/](https://palacevr.vercel.app/)

## Projection Method

Standard equirectangular projection for 180° video can cause peripheral distortion. This project implements a custom projection pipeline to mitigate these effects and improve viewing comfort.

The pipeline consists of the following stages:

1.  **Seamless Border Extension**: The video frame is extended with a reflected border to create a seamless peripheral view, eliminating black bars.
2.  **Fisheye Projection**: The extended frame is warped into a fisheye projection. This mapping preserves detail in the center of the field of view while gradually reducing resolution towards the edges.
3.  **2D-to-3D Conversion**: A monocular depth estimation model (Intel MiDaS) is used to generate a depth map for the video. This depth map is then used to create a stereoscopic 3D output, adding depth perception to the VR experience.

## Features

-   **Custom 180° Projection**: Implements a fisheye projection to reduce distortion in VR.
-   **Monocular 2D-to-3D Conversion**: Generates stereoscopic 3D video from a 2D source using AI-based depth estimation.
-   **User Authentication and Storage**: Manages user accounts and stores converted videos using Supabase.
-   **GPU-Accelerated**: The pipeline is accelerated using PyTorch, CuPy, and NVENC for efficient processing.
-   **VR Metadata Injection**: The output video is injected with the necessary metadata to be correctly interpreted as 180° VR content by compatible players and platforms.


## Implementation Details

The complete processing workflow is demonstrated in the following Google Colab notebook:

-   [**Colab Notebook**](https://colab.research.google.com/drive/14LdO2c4f02i2wGbXJECggiUmMlU4i0Zh?usp=sharing)
-   [**Sample inception clip 2d to vr 180**](https://drive.google.com/file/d/1RuOtmgs-KSZ622DOZulbame18hvK7H9j/view?usp=sharing)
-   [**Loom video demo recording**](https://www.loom.com/share/3b1d2fa97ffd401c81c98d4a6cbba2ec?sid=5ed872c2-156b-4cb8-bce4-3479739ce15b)

## Technology Stack

-   **Frontend**: Next.js, React, Tailwind CSS
-   **Backend**: Python, FastAPI
-   **Machine Learning**: PyTorch, Intel MiDaS
-   **GPU Computing**: CuPy, OpenCV
-   **Video Processing**: FFmpeg

## Contributing

Contributions are welcome. Please open an issue to report bugs or suggest features, or submit a pull request with improvements.
