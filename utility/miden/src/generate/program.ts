// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const PROGRAM = `
proc.number_add.4
    dup.0 loc_store.0 push.0 eq
    push.0 loc_store.3
    if.true
        dup.0 push.128 lt
        if.true
            dup.0
        else
            push.0
        end
    else
        push.1.1 loc_store.1
        while.true
            loc_load.1 dup.0
            add.1 loc_store.1 sub.1 dup.0 push.0 gt
            if.true
                push.1
                while.true
                    push.256 swap sub.1 dup.0 push.0 gt
                end
                drop
            else
                drop
            end
            loc_load.1 dup.0 loc_store.1 sub.1 dup.0 loc_store.2 push.1 gt
            while.true
                mul loc_load.2 sub.1 dup.0 loc_store.2 push.1 gt
            end
            loc_load.3 add loc_store.3
            loc_load.1 dup.0 loc_store.1
            loc_load.0 dup.0 loc_store.0 lte
        end
        loc_load.3
    end
    swap drop
end

proc.read_and_copy.60
    mem_load.99 dup.0 mem_store.99 dup.0 push.0 eq
    if.true
        drop drop dup.0 adv_push.7
    else
        swap dup.1 sub loc_store.0 adv_push.1 swap dup.0 sub.1 push.0 gt
        while.true
            adv_push.1 swap sub.1 dup.0 push.1 gt
        end
        drop mem_load.99 dup.0 mem_store.99 add.1
        dup.0 u32checked_mod.4 loc_store.1 u32checked_div.4 add.50
        loc_store.2 mem_storew.50 dropw push.51 loc_load.2 dup.0 loc_store.2 push.50 gt
        while.true
            dup.0 movdn.5 mem_storew dropw dup.0 add.1
            swap loc_load.2 dup.0 loc_store.2 lt
        end
        drop loc_load.2 dup.0 loc_store.2 dup.0 dup.0 dup.0 dup.0 mem_loadw
        push.4 loc_load.1 dup.0 loc_store.1 sub dup.0 push.4 eq
        if.true
            drop
        else
            dup.0 loc_store.3 push.1
            while.true
                movup.4 swap sub.1 dup.0 push.0 gt
            end
            drop loc_load.3 dup.0 push.0 gt
            while.true
                swap drop sub.1 dup.0 push.0 gt
            end
            drop
        end
        loc_load.2 dup.0 loc_store.2 sub.1 dup.0 sub.49 push.1 gte
        while.true
            dup.0 dup.0 dup.0 dup.0 dup.0 push.50 eq
            if.true
                mem_loadw.50
            else
                mem_loadw
            end
            movup.4 sub.1 dup.0 sub.49 push.1 gte
        end
        drop loc_load.2 dup.0 loc_store.2 dup.0 dup.0 dup.0 dup.0 mem_loadw
        push.4 loc_load.1 dup.0 loc_store.1 sub dup.0 push.4 eq
        if.true
            drop
        else
            dup.0 loc_store.3 push.1
            while.true
                movup.4 swap sub.1 dup.0 push.0 gt
            end
            drop loc_load.3 dup.0 push.0 gt
            while.true
                swap drop sub.1 dup.0 push.0 gt
            end
            drop
        end
        loc_load.2 dup.0 loc_store.2 sub.1 dup.0 sub.49 push.1 gte
        while.true
            dup.0 dup.0 dup.0 dup.0 dup.0 push.50 eq
            if.true
                mem_loadw.50
            else
                mem_loadw
            end
            movup.4 sub.1 dup.0 sub.49 push.1 gte
        end
        drop loc_load.0 dup.0 push.0 eq
        if.true
            drop
        else
            adv_push.1 swap dup.0 sub.1 push.0 gt
            while.true
                adv_push.1 swap sub.1 dup.0 push.1 gt
            end
            drop
        end
    end
end

proc.read_new_leaf
    adv_push.1 dup.0 dup.0 push.0 gt swap push.129 lt and
    if.true
        push.7 push.0 mem_store.99  push.1 mem_store.200
    else
        dup.0 push.128 gt push.1
        assert_eq dup.0 sub.128 dup.0 dup.0
        mem_store.99 push.8 lt
        if.true
            drop push.7
            push.1 mem_store.200
        else
            u32checked_div.4 dup.0 mem_store.200 mul.4 add.3
        end
    end
end

proc.multi_rphash
    mem_load.200 dup.0 push.1 eq
    if.true
        drop hmerge
    else
        push.1
        while.true
            sub.1
            movdn.8 hmerge
            movup.4 dup.0 push.1 gte
        end
        drop
    end
end



begin
    push.1 mem_store.101 adv_push.4 mem_storew.100 dropw`;
