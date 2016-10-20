EXTRN GetStdHandle:	PROC
EXTRN WriteFile:	PROC
EXTRN ReadFile:		PROC
EXTRN ReadConsoleA:	PROC
EXTRN lstrlen:		PROC
EXTRN ExitProcess:	PROC


.DATA

	hInput		QWORD 0
	hOutput		QWORD 0
	msglen		DWORD 0
	BytesWritten	DWORD 0
	BytesRead	DWORD 0
	msg			BYTE  "Hello World!", 13, 10, 0
	
	
.CODE

    main PROC
	
	sub rsp, 4
        lea rcx, msg
        call lstrlen
        mov msglen, eax
	add rsp, 4
	
	sub rsp, 4
	mov ecx, -11        ; STD_OUTPUT
	call GetStdHandle
        mov hOutput, rax
	add rsp, 4
	
	sub rsp, 4
	mov ecx, -10        ; STD_OUTPUT
	call GetStdHandle
        mov hInput, rax
	add rsp, 4
	
	sub rsp, 28h
        lea r9, BytesWritten
       	mov r8d, msglen
	lea rdx, msg
        mov rcx, hOutput
	call WriteFile
	add rsp, 28h
	
	
	sub rsp, 20h
        lea r9, BytesRead
       	mov r8d, 1
	lea rdx, msg
        push hInput
	call ReadConsoleA
	add rsp, 20h
	
	sub rsp, 4
        lea rcx, msg
        call lstrlen
        mov msglen, eax
	add rsp, 4
	
	sub rsp, 28h
        lea r9, BytesWritten
       	mov r8d, msglen
	lea rdx, msg
        mov rcx, hOutput
	call WriteFile
	add rsp, 28h
	
	sub rsp, 4
	xor ecx, ecx        ; exit code = 0
	call ExitProcess
	add rsp, 4

    main ENDP

END