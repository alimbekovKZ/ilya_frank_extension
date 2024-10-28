import functions_framework
from openai import OpenAI
import os

client = OpenAI(api_key="")

@functions_framework.http
def main(request):
    text = request.args.get('text')
    target_language = 'Russian'
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"Translate the following word to {target_language}."},
            {"role": "user", "content": text}
        ],
        max_tokens=30
    )

    translation = response.choices[0].message.content

    return translation
