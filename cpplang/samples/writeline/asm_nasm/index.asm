global main
extern GetStdHandle
extern WriteFile
extern lstrlen

section .data
msg:    ; char* msg;
	db    'Hello World!', 00h
msg_end:
BytesWritten:
	dq	0
msglen:
	dq	0
hFile:
	dq	0

	
section .text
main:
	sub 	rsp, 28h
	; msgLen = lstrlen(msg)
	mov 	rcx, msg
	;sub 	rsp, 8
        call 	lstrlen
        mov 	[msglen], eax
	;add 	rsp, 8
	
	; hFile = GetstdHandle( STD_OUTPUT_HANDLE)
	mov     rcx, -11 ; 0fffffff5h
	;sub	rsp, 8
	call    GetStdHandle
	;add	rsp, 8
	mov	[hFile], rax
	
	; WriteFile( hFile, msg, length(msg), &BytesWritten, 0);
	mov     rcx, [hFile]
	mov     rdx, msg
	mov     r8d, [msglen];msg_end-msg
	mov     r9, BytesWritten
	;sub 	rsp, 28h
	mov     dword [rsp + 20h], 00h
	call    WriteFile
	add     rsp, 28h
	
	
ExitProgram:
	xor     eax, eax
	ret

