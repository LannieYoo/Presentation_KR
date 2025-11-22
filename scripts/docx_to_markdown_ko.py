#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DOCX를 Markdown으로 변환하는 스크립트
DOCX 파일을 Markdown 형식의 문서로 변환합니다.

사용 방법:
    python docx_to_markdown.py <docx_file_path> [output_dir]

예제:
    python docx_to_markdown.py ../public/pdfs/knowledge-reasoning/Lab5\ KR\ Blocks/CST8503_Lab5_KR_Blocks.docx
"""

import os
import sys
import argparse
from pathlib import Path
from docx import Document
import re
from typing import List, Tuple, Optional

# Windows 콘솔 인코딩 문제 해결
if sys.platform == 'win32':
    import io
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except AttributeError:
        pass

def safe_print(*args, **kwargs):
    """한글 출력을 안전하게 처리하는 print 함수"""
    try:
        print(*args, **kwargs)
    except UnicodeEncodeError:
        # 인코딩 오류 시 ASCII로 변환하여 출력
        message = ' '.join(str(arg).encode('ascii', 'ignore').decode('ascii') for arg in args)
        print(message, **kwargs)


class DOCXToMarkdownConverter:
    """DOCX를 Markdown으로 변환하는 변환기"""

    def __init__(self):
        self.supported_formats = ['.docx']

    def extract_text_from_docx(self, docx_path: str) -> List[Tuple[int, str, Optional[int]]]:
        """
        DOCX 파일에서 텍스트 추출

        Args:
            docx_path: DOCX 파일 경로

        Returns:
            List[Tuple[int, str, Optional[int]]]: (문단번호, 텍스트, 헤더레벨) 튜플 리스트
                                                   헤더가 아니면 레벨은 None
        """
        try:
            paragraphs_text = []

            doc = Document(docx_path)
            for para_num, para in enumerate(doc.paragraphs, 1):
                text = para.text
                if text and text.strip():  # 빈 문단이 아닌 경우만 추가
                    # 헤더 스타일 확인
                    header_level = None
                    style_name = para.style.name if para.style else ""
                    
                    # Heading 스타일 감지
                    if "Heading" in style_name:
                        # "Heading 1", "Heading 2" 등에서 숫자 추출
                        match = re.search(r'Heading\s*(\d+)', style_name, re.IGNORECASE)
                        if match:
                            header_level = int(match.group(1))
                        elif "Heading" in style_name:
                            # 숫자가 없는 경우 기본값으로 1
                            header_level = 1
                    
                    paragraphs_text.append((para_num, text, header_level))

            return paragraphs_text

        except Exception as e:
            safe_print(f"오류: DOCX 파일을 읽을 수 없습니다 {docx_path}: {e}")
            return []

    def clean_text(self, text: str) -> str:
        """
        텍스트 정리 및 포맷팅

        Args:
            text: 원본 텍스트

        Returns:
            str: 정리된 텍스트
        """
        # 불필요한 공백 문자 제거
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def format_as_markdown(self, paragraphs_text: List[Tuple[int, str, Optional[int]]], title: str) -> str:
        """
        추출한 텍스트를 Markdown 형식으로 변환

        Args:
            paragraphs_text: (문단번호, 텍스트, 헤더레벨) 튜플 리스트
            title: 문서 제목

        Returns:
            str: Markdown 형식의 텍스트
        """
        markdown_content = []

        # 제목 추가
        markdown_content.append(f"# {title}\n")
        markdown_content.append("---\n\n")

        # 본문 내용 추가
        for para_num, text, header_level in paragraphs_text:
            cleaned_text = self.clean_text(text)
            if cleaned_text:
                if header_level is not None:
                    # 헤더로 변환 (최대 6레벨)
                    level = min(header_level, 6)
                    markdown_content.append(f"{'#' * level} {cleaned_text}\n")
                else:
                    # 일반 텍스트
                    markdown_content.append(f"{cleaned_text}\n")
                markdown_content.append("\n")

        return ''.join(markdown_content)

    def convert_docx_to_markdown(self, docx_path: str, output_dir: Optional[str] = None) -> str:
        """
        DOCX 파일을 Markdown 파일로 변환

        Args:
            docx_path: DOCX 파일 경로
            output_dir: 출력 디렉토리 (선택사항)

        Returns:
            str: 생성된 Markdown 파일 경로
        """
        docx_path = Path(docx_path)

        if not docx_path.exists():
            raise FileNotFoundError(f"DOCX 파일이 존재하지 않습니다: {docx_path}")

        if docx_path.suffix.lower() not in self.supported_formats:
            raise ValueError(f"지원하지 않는 파일 형식: {docx_path.suffix}")

        # 출력 디렉토리 결정
        if output_dir:
            output_dir = Path(output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)
        else:
            output_dir = docx_path.parent

        # 출력 파일명 생성
        output_filename = f"{docx_path.stem}.md"
        output_path = output_dir / output_filename

        safe_print(f"DOCX 파일 처리 중: {docx_path}")
        safe_print(f"출력 파일: {output_path}")

        # 텍스트 추출
        paragraphs_text = self.extract_text_from_docx(str(docx_path))
        if not paragraphs_text:
            raise ValueError("DOCX에서 텍스트 내용을 추출할 수 없습니다")

        safe_print(f"성공적으로 {len(paragraphs_text)}개의 문단 추출")

        # Markdown 생성
        title = docx_path.stem.replace('_', ' ').replace('-', ' ')
        markdown_content = self.format_as_markdown(paragraphs_text, title)

        # 파일 작성
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)

        safe_print(f"Markdown 파일이 생성되었습니다: {output_path}")
        return str(output_path)


def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(
        description="DOCX 파일을 Markdown 형식으로 변환",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예제:
  python docx_to_markdown.py ../public/pdfs/knowledge-reasoning/Lab5\\ KR\\ Blocks/CST8503_Lab5_KR_Blocks.docx
  python docx_to_markdown.py ../public/pdfs/knowledge-reasoning/Lab5\\ KR\\ Blocks/CST8503_Lab5_KR_Blocks.docx ./output
        """
    )

    parser.add_argument(
        'docx_path',
        help='DOCX 파일 경로'
    )

    parser.add_argument(
        'output_dir',
        nargs='?',
        help='출력 디렉토리 (선택사항, 기본값은 DOCX 파일이 있는 디렉토리)'
    )

    args = parser.parse_args()

    converter = DOCXToMarkdownConverter()

    try:
        docx_path = Path(args.docx_path)

        if docx_path.is_file():
            # 단일 파일 처리
            converter.convert_docx_to_markdown(str(docx_path), args.output_dir)
        else:
            safe_print(f"오류: 파일이 존재하지 않거나 유효한 DOCX 파일이 아닙니다: {docx_path}")
            sys.exit(1)

    except Exception as e:
        safe_print(f"오류: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

